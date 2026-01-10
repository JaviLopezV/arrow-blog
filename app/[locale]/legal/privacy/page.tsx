import LegalLayout from "../../components/LegalLayout";

export default function Page() {
  return (
    <LegalLayout title="Política de Privacidad">
      <p>
        <b>Responsable:</b> Javier López Villanueva
      </p>
      <p>
        <b>Email:</b> jlopvil@gmail.com
      </p>
      <p>
        <b>Sitio web:</b> https://arrow-blog.vercel.app
      </p>

      <p>
        Esta política describe cómo se recogen, utilizan y protegen los datos
        personales de los usuarios.
      </p>

      <p>
        <b>Datos tratados:</b>
      </p>
      <ul>
        <li>Email y nombre (opcional).</li>
        <li>Contraseña cifrada mediante hash seguro.</li>
        <li>Datos técnicos mínimos necesarios para seguridad.</li>
        <li>Cookies técnicas de sesión.</li>
      </ul>

      <p>
        <b>Finalidades:</b>
      </p>
      <ul>
        <li>Gestión de cuentas de usuario.</li>
        <li>Autenticación y acceso a la plataforma.</li>
        <li>Seguridad y prevención de fraude.</li>
      </ul>

      <p>Los datos no se venden ni se ceden a terceros.</p>

      <p>Puedes ejercer tus derechos RGPD escribiendo a jlopvil@gmail.com.</p>
    </LegalLayout>
  );
}
