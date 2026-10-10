# Configurar reCAPTCHA v2 con EmailJS

La web usa reCAPTCHA v2 tipo casilla. El widget se carga cuando una persona empieza a rellenar el formulario. La clave pública va en `VITE_RECAPTCHA_SITE_KEY`; la clave secreta se configura solo en EmailJS.

1. Registra una clave reCAPTCHA v2 para `zerocode-devops.com` (y `www.zerocode-devops.com` si ese host sirve la web directamente).
2. Añade la clave pública a `.env.local` en la raíz del monorepo:

   ```dotenv
   VITE_RECAPTCHA_SITE_KEY=clave_publica_del_sitio
   ```

3. En EmailJS, abre la plantilla indicada por `VITE_EMAILJS_TEMPLATE_ID`, activa la verificación reCAPTCHA v2 y pega allí la clave secreta de Google. No guardes esa clave en `.env`, en el navegador ni en una variable `VITE_`.
4. Para pruebas locales, crea una clave separada que permita `localhost`; no amplíes la clave de producción para pruebas.
5. Reinicia Vite o recompila la web y verifica un envío recibido, un token caducado y un fallo de red antes de publicarla.

Sin clave pública, el formulario no envía mensajes y muestra el correo y WhatsApp como alternativas. La política de privacidad y la de cookies ya informan sobre Google reCAPTCHA y la cookie técnica `_GRECAPTCHA`.
