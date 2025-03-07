from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from djmoney.models.fields import MoneyField

# Create your models here.
class InventoryItem(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    description = models.TextField(null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    addedBy = models.ForeignKey(User, on_delete=models.PROTECT, related_name="items")
    # we need to implement a way to contain all the incoming and outgoing orders for each of these items
    # assign to an array and loop through? we can do this by calling the relationship
    # item.incomingorder_set.all() returns all orders for a given item
    
    
    class Meta:
        ordering = ['-updated','-created']
    
    def __str__(self):
        return self.name
    
class IncomingOrder(models.Model):
    item = models.ForeignKey(InventoryItem, on_delete=models.PROTECT, null=True, blank=True, related_name='incoming_orders')
    item_name = models.CharField(max_length=20, blank=True, help_text="If item doesn't exist in inventory, enter name here")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    numOrdered = models.PositiveIntegerField()
    orderedBy = models.CharField(max_length=30)
    orderedOn = models.DateTimeField(auto_now_add=True)
    expectedDelivery = models.DateTimeField(null=True, blank=True)
    wasDelivered = models.BooleanField(default=False)
    deliveredOn = models.DateTimeField(null=True, blank=True)
    receivedBy = models.CharField(max_length=30, blank=True)
    notes = models.TextField(max_length=255, null=True, blank=True)
    invoiceNumber = models.CharField(max_length=50, blank=True, unique=True)
    
    class Meta:
        ordering = ['-orderedOn']
    
    def __str__(self):
        return f"Incoming order for {self.item} - Qty: {self.numOrdered}."
    
    def save(self, *args, **kwargs):
        # If 'item' is not set but 'item_name' is provided, create a new InventoryItem
        if self.item is None and self.item_name:
            # Or check if it already exists first
            existing_item = InventoryItem.objects.filter(name__iexact=self.item_name).first()
            if existing_item:
                self.item = existing_item
            else:
                self.item = InventoryItem.objects.create(
                    name = self.item_name,
                    quantity = 0
                )
        
        # Checks if this is an existing record
        if self.pk:
            # Fetch the existing record from the database
            old_record = IncomingOrder.objects.get(pk=self.pk)
            
            # If the old record wasDelivered is True, do not allow reverting to False
            if old_record.wasDelivered and not self.wasDelivered:
                raise ValidationError("Cannot set wasDelivered back to False once it has been set to True.")
            
            # If it was previously not delivered, but now it was delivered update the InventoryItem quantity
            if not old_record.wasDelivered and self.wasDelivered:
                self._update_inventory()
                
        else:
            # If this is a new record and wasDelivered is True immediately then update inventory
            if self.wasDelivered:
                self._update_inventory()
            
            
        super().save(*args, **kwargs)
        
    def _update_inventory(self):
        # Helper function to update the related InventoryItem quantity
        self.item.quantity += self.numOrdered
        self.item.save()
    
class OutgoingOrder(models.Model):
    item = models.ForeignKey(InventoryItem, on_delete=models.PROTECT)
    customer_name = models.CharField(max_length=255)
    num_ordered = models.PositiveIntegerField()
    ordered_by = models.CharField(max_length=200, blank=True, null=True)
    ordered_on = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    carrier = models.CharField(max_length=30)
    has_shipped = models.BooleanField(default=False)
    shipped_on = models.DateTimeField(auto_now_add=True)
    invoice_number = models.CharField(max_length=50)
    
    class Meta:
        ordering = ['-ordered_on']
    
    def __str__(self):
        return self.customer_name
    
    
    
    