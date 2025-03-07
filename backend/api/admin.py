from django.contrib import admin

# Register your models here.

from .models import InventoryItem, IncomingOrder, OutgoingOrder

admin.site.register(InventoryItem)
admin.site.register(IncomingOrder)
admin.site.register(OutgoingOrder)
