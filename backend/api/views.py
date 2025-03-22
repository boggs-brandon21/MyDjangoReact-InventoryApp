from .models import InventoryItem, IncomingOrder, OutgoingOrder, Conversation, Message, notify_staff
from django.contrib.auth.models import User
from rest_framework import generics, viewsets, status
from .serializers import UserSerializer, ItemSerializer, IncomingOrderSerializer, OutgoingOrderSerializer, ConversationSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from django.db.models import Count, Q
from rest_framework.decorators import action
from rest_framework.response import Response
    
# Enhancement: Incorporate viewsets.ModelViewSet instead of generics for API views and CRUD operations
# Reduces excessive code and handles all operations within one class
# ItemViewSet
class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]  # Leave as AllowAny while testing
    
    # Override our create method with perfom_create to handle notifications and variable assignment
    def perform_create(self, serializer):
        instance = serializer.save(addedBy=self.request.user)
        # Send our notification by calling our notify_staff() function
        text = f"An item was added to inventory: '{instance.name}'. Quantity: {instance.quantity}"
        notify_staff(text)
        
    # Also override our update to send notifications when changes are made to inventory items
    def perform_update(self, serializer):
        old_item = self.get_object()
        old_quantity = old_item.quantity
        instance = serailzer.save()
        
        # If the existing quantity was modified from the old_quantity
        if old_quantity < instance.quantity:
            # Assign our notification text to the variable text
            text = (
                f"Updated item quantity to {instance.item.quantity}. Was {old_quantity}"
            )
            notify_staff(text)
    
    
# Enhancement: Incorporate viewsets.ModelViewSet instead of generics for API views and CRUD operations
# Reduces excessive code and handles all operations within one class
# IncomingOrderViewSet
class IncomingOrderViewSet(viewsets.ModelViewSet):
    queryset = IncomingOrder.objects.all()
    serializer_class = IncomingOrderSerializer
    permission_classes = [AllowAny]  # Leave as AllowAny while testing
    
    # Override our create method with perfom_create to handle notifications and variable assignment
    def perform_create(self, serializer):
        instance = serializer.save()
        # Send our notification by calling our notify_staff() function
        text = f"A new incoming order has been created for: '{instance.item.name}'. Quantity: {instance.numOrdered}"
        notify_staff(text)
        
    # Also override our update to send notifications when changes are made to inventory items
    def perform_update(self, serializer):
        old_order = self.get_object()
        old_wasDelivered = old_order.wasDelivered
        
        instance = serailzer.save()
        
        # If the existing item was not originally delivered and is now delivered
        if not old_wasDelivered and instance.wasDelivered:
            # Assign our notification text to the variable text
            text = (
                f"The incoming order for '{instance.item.name}' was delivered. "
                f"Updated item quantity to {instance.item.quantity}."
            )
            notify_staff(text)
        
# Enhancement: Code Clarity and Reduction of Excess Code
# Utilizing viewsets.ModelViewSet to handle all of the CRUD operations instead of all generic APIViews
# OutgoingOrder ViewSet
class OutgoingOrderViewSet(viewsets.ModelViewSet):
    queryset = OutgoingOrder.objects.all()
    serializer_class = OutgoingOrderSerializer
    permission_classes = [AllowAny]  # Stick with AllowAny for now for testing purposes
    
# ModelViewSet for all CRUD operations for Conversations
class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    # Customize get_queryset so a user can only view messages that pertain to them
    def get_queryset(self):
        user = self.request.user
        queryset = Conversation.objects.filter(participants=user)
        
        # NEW: Annotate with unread messages count for the user for easier access on front end
        queryset = queryset.annotate(
            unread_count = Count(
                'messages', filter = Q(messages__is_read=False, messages__receivers=user)
            )
        )
        return queryset
    
    def perform_create(self, serializer):
        if "conversation" in self.request.data:
            conversation_id = self.request.data.get("conversation")
            conversation = get_object_or_404(Conversation, id=conversation_id)
            
            # Check notification_only if needed
            if conversation.notification_only and self.request.user.username != "System":
                raise PermissionDenied("You cannot reply to a notificaton-only conversation.")
            
            if conversation.notification_only:
                self.subject = "System Notification"
                
        serializer.save()
            
        

# MessageViewSet for all CRUD operations for Messages
class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    # Add an action decorator to handle is_read for messages by building a custom endpoint to call in React 
    @action(detail=False, methods=['patch'], url_path='mark-read')
    def mark_read(self, request):
        conversation_id = request.data.get("conversation")
        if not conversation_id:
            return Response({"detail": "Conversation id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the messages in the specified conversation where the current user is a receiver and not yet read
        messages = Message.objects.filter(
            conversation_id=conversation_id,
            receivers=request.user,
            is_read=False
        )
        
        # Update the message to set is_read to true
        messages.update(is_read=True)
        return Response({"detail": "Messages marked as read"}, status=status.HTTP_200_OK)
    
    # Ensure the user is only able to access messages where the user is a participant in conversations
    def get_queryset(self):
        user = self.request.user
        queryset = Message.objects.filter(conversation__participants=user)
        
        # Optionally filter by conversation if a conversation id is provided
        conversation_id = self.request.query_params.get('conversation')
        if conversation_id:
            queryset = queryset.filter(conversation__id = conversation_id)
            
        # If the unread query parameter is provided and true, filter unread messages for the receiver
        unread = self.request.query_params.get('unread')
        if unread and unread.lower() == 'true':
            queryset = queryset.filter(is_read=False, receivers=user)
            
        return queryset
    
    # Ensure the user is set as the sender when a message is sent
    def perform_create(self, serializer):
        # Client passes the id of the conversation for identification
        conversation_id = self.request.data.get("conversation")
        conversation = get_object_or_404(Conversation, id=conversation_id)
        
        # Make sure the sender for a notification_only conversation is System
        if conversation and conversation.notification_only:
            system_user = User.objects.get(username="System")
            message = serializer.save(sender=system_user, conversation = conversation)
        else:
            message = serializer.save(sender = self.request.user, conversation = conversation)
        
        # If message is notification_only and the user isn't the System user, block it
        if conversation.notification_only and self.request.user.username != "System":
            raise PermissionDenied("You cannot reply to a notification-only conversation.")
        
        # # determine the receivers as the other participants in the conversation exlcuding the sender
        # message = serializer.save(sender=self.request.user, conversation=conversation)
        receivers = conversation.participants.exclude(id=self.request.user.id)
        message.receivers.set(receivers)
        
# Create the user view with viewsets
class UserModelListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
       

# Create the user view
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()  # List of dif obj we are looking at to not dupe users
    serializer_class = UserSerializer  # Accept this data to make a new user
    permission_classes = [AllowAny]  # Who can actually call this? Anyone in this case
    
class RetrieveUserView(generics.RetrieveAPIView):
    queryset = User.objects.all()  # List of dif obj we are looking at to not dupe users
    serializer_class = UserSerializer  # Accept this data to make a new user
    permission_classes = [AllowAny]  # Who can actually call this? Anyone in this case
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
 
