from rest_framework import serializers
from .models import *


class PlayerSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['name', 'numberOfChips', 'password', 'turn']

class PlayerSigninSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['name', 'password'] 

class CreateTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['createdBy', 'numberOfPlayers', '']               