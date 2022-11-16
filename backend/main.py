import logging
import os
import time
from dataclasses import dataclass

import functions_framework
import requests
import ujson as json

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)
log.addHandler(logging.StreamHandler())

OPTIONS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600'
}
POST_HEADERS = {'Access-Control-Allow-Origin': '*'}
SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
SECRET_KEY = os.environ.get('CF_TURNSTILE_SECRET', 'Secret Key Not Set')


@dataclass(frozen=True, slots=True)
class FormData:
    """Data from the form."""
    fullName: str
    email: str
    verifyEmail: str
    idNumber: str
    phoneNumber: str
    time: float
    captchaOk: bool


def make_form_data(request, data: dict) -> dict[str, str | float | bool]:
    """
    Creates a dict based on FormData fields.
    :param data:
    :return:
    """
    data = {k: data.get(k) for k in FormData.__annotations__}
    data['captchaOk'] = captcha_ok(request)
    data['time'] = time.time()
    return data


def captcha_ok(request) -> bool | None:
    """
    Validates the request against the Cloudflare Turnstile API.
    :param request: flask request object
    :return: validation result
    """
    data = request.get_json(silent=True)
    if data is None:
        return False

    siteverify_data = {
        'secret': SECRET_KEY,
        'response': data.get('turnstileToken'),
        'remoteip': request.headers.get('CF-Connecting-IP')
    }
    response = requests.post(SITEVERIFY_URL, data=siteverify_data)
    try:
        return response.json().get('success')
    except json.JSONDecodeError:
        return False


@functions_framework.http
def register(request):
    """
    Handles the registration form.

    :param request: flask request object
    :return:
    """
    if request.method == 'OPTIONS':
        return '', 204, OPTIONS_HEADERS
    elif request.method == 'POST':
        return handle_post(request)
    else:
        return '', 405, OPTIONS_HEADERS


def handle_post(request):
    """
    Validates the form data and logs the result.
    :param request: flask request object
    :return:
    """
    if request.content_length > 1024 * 16:
        return ['🤯'], 413, POST_HEADERS
    if request.headers.get('Content-Type') != 'application/json':
        return ['🤔'], 415, POST_HEADERS
    if (data := request.get_json(silent=True)) is None:
        return ['🤔'], 400, POST_HEADERS
    form_data = make_form_data(request, data)
    log.info(json.dumps(form_data))
    if not form_data["captchaOk"]:
        return ['🔒'], 403, POST_HEADERS
    else:
        return ['❤️'], 201, POST_HEADERS
