from django.contrib.auth.models import User
from rest_framework import serializers
from .models import InventoryItem, IncomingOrder, OutgoingOrder, Conversation, Message
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework_simplejwt.views import TokenObtainPairView


# Django uses an ORM to map python objects to code needed to execute a db change
# Serializers convert the python objects to JSON to interact with frontend and other apps over the web

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email"]
        extra_kwargs = {"password": {"write_only": True}}
        
    # function to create a new user with validated data from fields    
    # def create(self, validated_data):
    #     user = User.objects.create_user(**validated_data)  # splitting up keyword arguments to pass data from a dictionary
    #     return user
    
class ItemSerializer(serializers.ModelSerializer):
    # Tells the DRF to return the string version of the related user
    addedBy = serializers.StringRelatedField()
    class Meta:
        model = InventoryItem
        fields = '__all__'
    
    # Uneccessary as we aren't overiding the default method... will use to handle email notifications
    # def create(self, validated_data):
    #     item = InventoryItem.objects.create(**validated_data)
    #     return item
        
        
class IncomingOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomingOrder
        fields = '__all__'
        
    # Uneccessary as we aren't overiding the default method... will use to handle email notifications
    # def create(self, validated_data):
    #     order = IncomingOrder.objects.create(**validated_data)
    #     return order
    
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
        
    # Uneccessary as we aren't overiding the default method... will use to handle email notifications
    # def create(self, validated_data):
    #     order = OutgoingOrder.objects.create(**validated_data)
    #     return order
    

class MessageSerializer(serializers.ModelSerializer):
    # Assign the sender as the user who created the message
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
            'messages',  # Provides a nested list of messages
        ]
        read_only_fields = ['id', 'created_at', 'messages', 'unread_count']
        
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
    

    
