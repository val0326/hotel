import os
from dotenv import load_dotenv, find_dotenv
import requests
import pytest
from src.config import TEST_USER_PAYLOAD, TEST_USER_PAYLOAD_2


load_dotenv(find_dotenv())

url_test_user = os.getenv("URL_TEST_USER")


@pytest.fixture()
def obj_id():
    response = requests.post(url_test_user, json=TEST_USER_PAYLOAD).json()
    user_id = response["id"]
    yield user_id
    requests.delete(f"{url_test_user}/{user_id}")


def test_create_object(obj_id):
    response = requests.post(url_test_user, json=TEST_USER_PAYLOAD_2).json()
    assert response["email"] == TEST_USER_PAYLOAD_2["email"]
    requests.delete(f"{url_test_user}/{response['id']}")


def test_get_list_of_users():
    response = requests.get(url_test_user)
    assert response.status_code == 200


def test_get_object(obj_id):
    response = requests.get(f"{url_test_user}/{obj_id}").json()
    assert response["id"] == obj_id
