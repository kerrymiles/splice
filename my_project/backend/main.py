from fastapi import FastAPI, Request, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

from typing import Dict, List, Any
from pathlib import Path

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from models import Get

import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

static_path = Path(__file__).resolve().parent.parent / "frontend" / "static"
templates_path = Path(__file__).resolve().parent.parent / "frontend" / "templates"

print('----------------------------------------------------------------')
print(f'URL of directory \'static\': {static_path}')
print(f'URL of directory \'templates\': {templates_path}')
print('----------------------------------------------------------------')

app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

templates = Jinja2Templates(directory=str(templates_path))

@app.get('/', response_class=HTMLResponse)
async def root(request: Request):
    try:
        logger.info("index.html successfully served.")
        return templates.TemplateResponse('index.html', {"request": request})
    except Exception as e:
        logger.error(f'Error INDEX.HTML NOT FOUND: {e}')
        print(f'Error INDEX.HTML NOT FOUND: {e}')
        raise HTTPException(status_code=404, detail="Page not found")
@app.get("/sounds", response_class=HTMLResponse)
async def get_html(request: Request, page: int = 1):
    data = Get(page)
    return templates.TemplateResponse("sounds.html", {"request": request, "data": data, "has_next": len(data) > 0})

@app.get("/{name}", response_class=HTMLResponse)
async def render(request: Request, name: str):
    try:
        logger.info(f"GET request to /{name}")
        return templates.TemplateResponse(f"{name}.html", {"request": request})
    except Exception as e:
        print(f'Error PAGE {name} NOT FOUND: {e}')
        raise HTTPException(status_code=404, detail="Page not found")

@app.get('/api/sounds', response_model=Dict[str, List[str]])
async def get_json(page: int = 1):
    try:
        logger.info("GET request to /api/sounds")
        parse_data = Get(page)
        if not isinstance(parse_data, dict):
            raise ValueError("Returned data is not a dictionary")
        for key, value in parse_data.items():
            if not isinstance(key, str) or not isinstance(value, list):
                raise ValueError("Invalid data structure")
        return parse_data
    except Exception as e:
        logger.error(f'ERROR in MAIN.PY: {e}')
        raise HTTPException(status_code=500, detail="Internal Server Error")



# @app.get('/sounds/{page}')

@app.post('/submit')
async def submit(
    username: str = Form(...),
    email: str = Form(...),
    message: str = Form(...)
):
    
    smtp_server_host = 'mail.smtp2go.com'
    smtp_server_port = 2525
    smtp_server_username = 'doolk.com'
    smtp_server_password = '8FfrR52c5INgCfOL'

    from_addr = smtp_server_username
    to_addr = email

    subject = 'Splice Prod.'

    message = f"""
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">
<html>
<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
</head>
<body>
    <table cellspacing="0" cellpadding="0" border="0" style="margin:0;padding:0;" width="100%" max-width="600px">
        <thead>
            <th>
                <a href="https://splice.com" style="color:#222222;font:42px Arial,sans-serif;line-height:150%;-webkit-text-size-adjust:none;display:block;text-decoration:underline;" target="_blank">Splice Prod.</a>
            </th>
            <tr>
                <th>
                    <span style="color:#222222;font:24px Arial,sans-serif;line-height:125%;-webkit-text-size-adjust:none;display:block;"><b>Your Application</b></span>
                </th>
            </tr>
        </thead>
        <table cellspacing="0" cellpadding="0" border="0" style="margin:0;padding:0;" width="100%" height="100%" bgcolor="#b2c">
            <tr>
                <td>
                    <span style="top:150px;left:280px;position:absolute;line-height:125%;font:42px Arial,sans-serif;color:#222222;-webkit-text-size-adjust:none;text-decoration:underline;">Dear, {username}!</span>
                    <span style="top:150px;left:280px;position:absolute;line-height:125%;font:32px Arial,sans-serif;color:#222222;background:#333333;-webkit-text-size-adjust:none;text-decoration:underline;">Your message<br>:{message}!</span>
                    <span style="top:205px;left:280px;position:absolute;line-height:125%;font:22px Arial,sans-serif;color:#222222;-webkit-text-size-adjust:none;">We have received your message.<br>Tell us the details by a return letter <br> and we will try to solve your issue</span>
                </td>
                <th colspan="2">
                    <img src="https://th.bing.com/th/id/OIP.mrjMbXjdU6fx1jrck11MrgHaFj?rs=1&pid=ImgDetMain" border="0" width="600px" height="600px" style="margin-top:50px;" alt="">
                </th>
            </tr>
        </table>
    </table>
</body>
</html>
"""
    msg = MIMEMultipart('alternative')
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg['Subject'] = subject

    msg.attach(MIMEText(message, 'html'))

    try:
        mailServer = smtplib.SMTP(smtp_server_host, smtp_server_port)
        mailServer.ehlo()
        mailServer.starttls()
        mailServer.ehlo()
        mailServer.login(smtp_server_username, smtp_server_password)
        mailServer.sendmail('lun88385@doolk.com', to_addr, msg.as_string())
        mailServer.close()
        return {"message": "Email sent successfully."}
    except Exception as e:
        return {"error": f"Failed to send message {e}"}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8080)