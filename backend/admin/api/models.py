from django.db import models

# Create your models here.
class Player(models.Model):
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    numberOfChips = models.CharField(max_length=100)
    turn = models.BooleanField(null=True)    

class Table(models.Model):
    createdBy = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='owner')
    numberOfPlayers = models.CharField(max_length=100)
    players = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='tables')

class Card(models.Model):
    suit = models.CharField(max_length=100)
    value = models.CharField(max_length=100)

class Deck(models.Model):
    cards = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="deck")

class Round(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE, related_name="rounds")
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='rounds')
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='rounds')
    bet = models.CharField(max_length=100)
    hit = models.BooleanField(null=True)
    stand = models.BooleanField(null=True)
    double = models.BooleanField(null=True)
    split = models.BooleanField(null=True)
    bust = models.BooleanField(null=True)
    win = models.BooleanField(null=True)