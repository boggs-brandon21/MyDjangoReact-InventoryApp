from django.contrib import admin

# Register your models here.

from .models import InventoryItem, IncomingOrder, OutgoingOrder, Conversation, Message

admin.site.register(InventoryItem)
admin.site.register(IncomingOrder)
admin.site.register(OutgoingOrder)
admin.site.register(Conversation)
admin.site.register(Message)
