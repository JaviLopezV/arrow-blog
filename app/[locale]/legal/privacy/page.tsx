import LegalLayout from "../../components/LegalLayout";

export default function Page() {
  return (
    <LegalLayout title="Política de Privacidad">
      <p>
        Esta Política de Privacidad describe cómo se recogen, utilizan y
        protegen los datos personales de los usuarios del sitio web Arrow Blog.
      </p>

      <h3>1. Responsable del tratamiento</h3>
      <p>
        <b>Responsable:</b> Javier López Villanueva
        <br />
        <b>Email de contacto:</b> jlopvil@gmail.com
        <br />
        <b>Sitio web:</b> https://arrow-blog.vercel.app
      </p>

      <h3>2. Datos personales que se pueden tratar</h3>
      <ul>
        <li>
          <b>Datos de cuenta:</b> nombre (opcional), email.
        </li>
        <li>
          <b>Credenciales:</b> contraseña (almacenada de forma segura mediante
          hash; no se guarda en texto plano).
        </li>
        <li>
          <b>Datos técnicos:</b> IP aproximada, información de navegador
          necesaria para el funcionamiento del servicio y la seguridad.
        </li>
        <li>
          <b>Cookies técnicas:</b> cookies de sesión/autenticación necesarias
          para iniciar sesión y mantener la sesión.
        </li>
      </ul>

      <h3>3. Finalidades del tratamiento</h3>
      <ul>
        <li>Crear y gestionar cuentas de usuario.</li>
        <li>Permitir el inicio de sesión y uso de funcionalidades.</li>
        <li>Mantener la seguridad, prevenir fraude y abuso.</li>
        <li>Atender solicitudes del usuario (soporte y derechos RGPD).</li>
      </ul>

      <h3>4. Base jurídica</h3>
      <ul>
        <li>
          <b>Ejecución de un servicio solicitado</b> (gestión de cuenta y acceso
          a la plataforma).
        </li>
        <li>
          <b>Consentimiento</b> (aceptación de esta política y, cuando aplique,
          cookies no esenciales).
        </li>
        <li>
          <b>Interés legítimo</b> (seguridad, prevención de abuso y protección
          del servicio).
        </li>
      </ul>

      <h3>5. Destinatarios y encargados</h3>
      <p>
        Para prestar el servicio pueden intervenir proveedores técnicos que
        actúan como <b>encargados del tratamiento</b>, por ejemplo:
      </p>
      <ul>
        <li>
          <b>Neon (PostgreSQL)</b> como proveedor de base de datos
          (almacenamiento de datos).
        </li>
        <li>
          <b>Vercel</b> como plataforma de despliegue/hosting del sitio web.
        </li>
        <li>
          Herramientas de autenticación basadas en <b>NextAuth</b> (gestión de
          sesión mediante cookies técnicas).
        </li>
      </ul>
      <p>No se venden datos personales a terceros.</p>

      <h3>6. Transferencias internacionales</h3>
      <p>
        Algunos proveedores tecnológicos pueden tratar datos desde fuera del
        Espacio Económico Europeo. En tal caso, se procurará que existan
        garantías adecuadas conforme al RGPD (p. ej., cláusulas contractuales
        tipo u otros mecanismos aplicables).
      </p>

      <h3>7. Plazos de conservación</h3>
      <ul>
        <li>
          Los datos de la cuenta se conservan mientras la cuenta permanezca
          activa.
        </li>
        <li>El usuario puede solicitar la eliminación de su cuenta y datos.</li>
        <li>
          Ciertos registros técnicos podrán conservarse durante el tiempo
          estrictamente necesario por motivos de seguridad y prevención de
          abuso.
        </li>
      </ul>

      <h3>8. Derechos de las personas usuarias</h3>
      <p>
        Puedes ejercer los derechos de <b>acceso</b>, <b>rectificación</b>,
        <b>supresión</b>, <b>oposición</b>, <b>limitación</b> y{" "}
        <b>portabilidad</b> enviando un email a <b>jlopvil@gmail.com</b>.
      </p>
      <p>
        Para proteger tu privacidad, podremos solicitar información adicional
        para verificar tu identidad antes de atender la solicitud.
      </p>

      <h3>9. Seguridad</h3>
      <p>
        Se aplican medidas técnicas y organizativas razonables para proteger los
        datos personales, incluyendo el almacenamiento seguro de contraseñas
        mediante hash y controles de acceso.
      </p>

      <h3>10. Menores</h3>
      <p>
        Actualmente no se aplica un sistema de verificación de edad. Si eres
        menor de 14 años (en España), no debes registrarte sin el consentimiento
        de tu madre/padre o tutor legal.
      </p>

      <h3>11. Cambios en esta política</h3>
      <p>
        Esta política puede actualizarse para reflejar cambios en el servicio o
        requisitos legales. La versión vigente estará siempre publicada en esta
        página.
      </p>
    </LegalLayout>
  );
}
