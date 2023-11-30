from django.db import models

# Create your models here.


class User(models.Model):
    name = models.CharField(max_length=100,null=True)
    wallet_address = models.CharField(max_length=100,null=False)
    private_key = models.CharField(max_length=100,null=False)
    deposit_amount = models.CharField(max_length=100,null=False)

    def __str__(self) -> str:
        return str(self.wallet_address)


class ProjectTeam(models.Model):
    name = models.CharField(max_length=100,null=False, default=None)
    owner_address = models.CharField(max_length=100,null=False, default=None)
    contract_address = models.CharField(max_length=100,null=False, default=None)

    def __str__(self) -> str:
        return str(self.name)


class Creator(models.Model):
    name = models.CharField(max_length=100,null=False, default=None)
    creator_address = models.CharField(max_length=100,null=False, default=None)

    def __str__(self) -> str:
        return str(self.name)

