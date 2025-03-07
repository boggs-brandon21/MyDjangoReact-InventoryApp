from django.contrib.auth.models import User
from rest_framework import serializers
from .models import InventoryItem, IncomingOrder, OutgoingOrder
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


# Django uses an ORM to map python objects to code needed to execute a db change
# Serializers convert the python objects to JSON to interact with frontend and other apps over the web

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
        
    # function to create a new user with validated data from fields    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)  # splitting up keyword arguments to pass data from a dictionary
        return user
    
class ItemSerializer(serializers.ModelSerializer):
    # Tells the DRF to return the string version of the related user
    addedBy = serializers.StringRelatedField()
    class Meta:
        model = InventoryItem
        fields = '__all__'
    
    # Research this further to see if it needs to be in views or serializer
    def create(self, validated_data):
        item = InventoryItem.objects.create(**validated_data)
        return item
        
        
class IncomingOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomingOrder
        fields = '__all__'
        
    # Create an Order - Need to add authentication controls
    def create(self, validated_data):
        order = IncomingOrder.objects.create(**validated_data)
        return order
    
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
        
    # Create an OutgoingOrder - Need to add authentication controls
    def create(self, validated_data):
        order = OutgoingOrder.objects.create(**validated_data)
        return order