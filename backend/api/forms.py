from django.forms import ModelForm
from .models import InventoryItem, OutgoingOrder, IncomingOrder

class ItemForm(ModelForm):
    class Meta:
        model = InventoryItem
        fields = '__all__'
        
        
class IncomingOrderForm(ModelForm):
    class Meta:
        model = IncomingOrder
        fields = '__all__'