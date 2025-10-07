# Configuración del Sistema de Email Automático

## Pasos para configurar EmailJS

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar servicio de email
1. En el dashboard, ve a "Email Services"
2. Agrega tu servicio de email (Gmail recomendado)
3. Conecta tu cuenta de Gmail (kryydev@gmail.com)
4. Copia el **Service ID**

### 3. Crear template de email
1. Ve a "Email Templates"
2. Crea un nuevo template con el siguiente contenido:

**Subject:** Nuevo mensaje desde tu portafolio - {{from_name}}

**Body:**
```
Hola Daniel,

Has recibido un nuevo mensaje desde tu portafolio:

Nombre: {{from_name}}
Email: {{from_email}}

Mensaje:
{{message}}

---
Este mensaje fue enviado automáticamente desde tu portafolio.
```

3. Copia el **Template ID**

### 4. Obtener Public Key
1. Ve a "Account" > "General"
2. Copia tu **Public Key**

### 5. Actualizar el código
Reemplaza en `script.js` las siguientes líneas:

```javascript
// Línea 146: Reemplaza "YOUR_PUBLIC_KEY"
emailjs.init("TU_PUBLIC_KEY_AQUI");

// Línea 160: Reemplaza "YOUR_SERVICE_ID"
'TU_SERVICE_ID_AQUI',

// Línea 161: Reemplaza "YOUR_TEMPLATE_ID"
'TU_TEMPLATE_ID_AQUI',
```

### 6. Probar el sistema
1. Abre tu portafolio en el navegador
2. Ve a la sección de contacto
3. Envía un mensaje de prueba
4. Verifica que recibas el email en kryydev@gmail.com

## Características del sistema

- ✅ Envío automático de emails a kryydev@gmail.com
- ✅ Almacenamiento local de mensajes para el panel de administración
- ✅ Validación de formulario
- ✅ Feedback visual durante el envío
- ✅ Manejo de errores
- ✅ Integración con EmailJS (gratuito hasta 200 emails/mes)

## Notas importantes

- El sistema funciona completamente desde el frontend
- No necesitas servidor backend
- Los emails se envían automáticamente cuando alguien completa el formulario
- Los mensajes también se guardan en localStorage para el panel de admin
- EmailJS es gratuito hasta 200 emails por mes
