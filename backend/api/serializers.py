from django.contrib.auth.models import User
from rest_framework import serializers
from .models import InventoryItem, IncomingOrder, OutgoingOrder, Conversation, Message



# Django uses an ORM to map python objects to code needed to execute a db change
# Serializers convert the python objects to JSON to interact with frontend and other apps over the web

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}
        
    
class ItemSerializer(serializers.ModelSerializer):
    # Tells the DRF to return the string version of the related user
    addedBy = serializers.StringRelatedField()
    class Meta:
        model = InventoryItem
        fields = '__all__'
    
        
        
class IncomingOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomingOrder
        fields = '__all__'
        
    # Dynamically display the InventoryItem name based on the FK of item in IncomingOrders
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.item:
            data['item_name'] = instance.item.name
        return data
        
class OutgoingOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutgoingOrder
        fields = '__all__'
        
    

class MessageSerializer(serializers.ModelSerializer):
    # Assign the sender as the user who created the message
    sender = UserSerializer(read_only=True)
    class Meta:
        model = Message
        fields = [
            'id',
            'conversation',
            'sender',
            'receivers',
            'text',
            'created_at',
            'sent_at',
            'is_read',
        ]
        read_only_fields = ['id', 'created_at', 'sent_at', 'sender', 'receivers']
        
    
class ConversationSerializer(serializers.ModelSerializer):
    # Retrieve the messages for the conversation
    messages = MessageSerializer(many=True, read_only=True)
    # Serialize the unread_count to pass to front end
    unread_count = serializers.IntegerField(read_only=True)
    
    # Modify participants
    participants = UserSerializer(many=True, read_only=True)
    
    # Add a write field that is able to work with the front end for the participants
    participant_ids = serializers.PrimaryKeyRelatedField(many=True, write_only=True, queryset=User.objects.all())
    
    class Meta:
        model = Conversation
        fields = [
            'id',
            'participants',
            'participant_ids',
            'created_at',
            'unread_count',
            'messages', # Provides a nested list of messages
            'subject',
            'notification_only'  
        ]
        read_only_fields = ['id', 'created_at', 'messages', 'unread_count', 'notification_only']
        
    def create(self, validated_data):
        # Get the participant IDs from the validated data
        participant_ids = validated_data.pop('participant_ids', [])
        # Create the conversation instance
        conversation = Conversation.objects.create(**validated_data)
        # Ensure the current user is included
        request = self.context.get('request')
        if request and request.user not in participant_ids:
            participant_ids.append(request.user)
        # Set participants using the write-only field
        conversation.participants.set(participant_ids)
        return conversation
    

    
