from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from djmoney.models.fields import MoneyField  # Investigate implementation, causes errors 

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
    invoiceNumber = models.CharField(max_length=50, blank=True, unique=True, null=True)
    
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
        text = f"An item was added to inventory: {self.item_name}. Quantity: {self.item.quantity}."
    
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
        return f"Customer: {self.customer_name}, Ordered: {self.num_ordered} of {self.item}."
    
    
    
# TODO implement Customers Model   


# Incorporating a Conversation model that holds messages for quick access to message another user
class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name="conversations")
    created_at = models.DateTimeField(auto_now_add=True)
    subject = models.CharField(max_length=100, null=True, blank=True)
    
    # Additional field for notifications
    notification_only = models.BooleanField(default=False)
    
    def __str__(self):
        if self.notification_only:
            return "System Notification - No Reply"
        else:
            return f"{self.subject}"

# TODO implement Message Model
class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete= models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete= models.CASCADE, related_name="sender")
    receivers = models.ManyToManyField(User, related_name="received_messages")
    text = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    # Order the messages by most recent
    class Meta:
        ordering = ['sent_at']
        
    def __str__(self):
        if not self.conversation.notification_only:
            return "System Notification Message"
        else:
            return f"From: {self.sender.username}"
        
        
# Utility Function to handle the creation of a system message to notify staff of significant events 
# Modified to create one message to send to all staff members in one conversation - was sending one for each participant
def notify_staff(text: str):
    User = get_user_model()
    
    # Obtain the system user.
    system_user = User.objects.get(username="System")
    
    # Get all staff users.
    staff = User.objects.filter(is_staff=True)
    
    # Get or create a conversation for staff notifications.
    convo, created = Conversation.objects.get_or_create(
        subject="Staff Notifications",
        notification_only=True
    )
    
    # Ensure the conversation participants are up to date.
    convo.participants.set(staff)
    
    # Create a single message.
    msg = Message.objects.create(
        conversation=convo,
        sender=system_user,
        text=text
    )
    
    # Add all staff users (except the system user) as receivers.
    receivers = staff.exclude(username="System")
    msg.receivers.set(receivers)

    
    
    
    
    
