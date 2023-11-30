
from django.shortcuts import render
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response

# Create your views here.
from web3py_ext import extend
from web3 import Web3
from eth_account import Account
from django.conf import settings
from web3.middleware import construct_sign_and_send_raw_middleware

import json

from api.models import User

owner = Account.from_key('0x7835a42d5bd8dca5ad009fde6da091b42e99a89ec2c6a9df700e3fa827ac6ecc')
acc_list = [
    owner,
]
w3 = Web3(Web3.HTTPProvider('https://public-en-baobab.klaytn.net'))
mainnet = Web3(Web3.HTTPProvider('https://public-en-cypress.klaytn.net'))
w3.middleware_onion.add(construct_sign_and_send_raw_middleware(acc_list))
mainnet.middleware_onion.add(construct_sign_and_send_raw_middleware(acc_list))
# Web3 인스턴스 생성


# settings에서 ABI와 주소 정보 가져오기
surri_address = Web3.to_checksum_address(settings.SURRI_ADDRESS)
bummy_address = Web3.to_checksum_address(settings.BUMMY_ADDRESS)
client_s = "0x61327612EC4aFD93e370eC0599f933bB08020A54"
client_b = "0x65CAFeFA9cb3bA556Efd416fE4281F2Ee30BB36b"

# 스마트 컨트랙트 인스턴스 생성
nft_contract_s = mainnet.eth.contract(address=surri_address, abi=settings.KIP17_ABI)
nft_contract_b = mainnet.eth.contract(address=bummy_address, abi=settings.KIP17_ABI)
#tx_hash = contract.functions.ownermint(Web3.to_peb(10, 'klay')).transact({'from': owner.address})

# 함수 호출 예시
# 예를 들어, 스마트 컨트랙트의 'myFunction'이라는 함수가 있고, 이 함수가 uint256 타입의 파라미터를 받는다면:


class getNFTView_s(RetrieveAPIView):
        queryset = User.objects.all()
        def get(self, request, *args, **kwargs):
            # 스마트 컨트랙트의 함수 호출
            balance = nft_contract_s.functions.balanceOf(client_s).call()
            nfts = []
            for i in range(balance):
                token_id = nft_contract_s.functions.tokenOfOwnerByIndex(client_s, i).call()
                token_uri = nft_contract_s.functions.tokenURI(token_id).call()
                nfts.append({
                    'token_id': token_id,
                    'token_uri': token_uri,
                })
            return Response(nfts)

class getNFTView_b(RetrieveAPIView):
        queryset = User.objects.all()
        def get(self, request, *args, **kwargs):
            # 스마트 컨트랙트의 함수 호출
            balance = nft_contract_b.functions.balanceOf(client_b).call()
            nfts = []
            for i in range(balance):
                token_id = nft_contract_b.functions.tokenOfOwnerByIndex(client_b, i).call()
                token_uri = nft_contract_b.functions.tokenURI(token_id).call()
                nfts.append({
                    'token_id': token_id,
                    'token_uri': token_uri,
                })
            return Response(nfts)