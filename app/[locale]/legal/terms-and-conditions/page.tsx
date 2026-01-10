import LegalLayout from "../../components/LegalLayout";

export default function Page() {
  return (
    <LegalLayout title="Términos y Condiciones de Uso">
      <p>
        Estos Términos y Condiciones establecen las reglas aplicables al uso de
        Arrow Blog. Al acceder, navegar o registrarte, aceptas cumplirlas.
      </p>

      <h3>1. Objeto</h3>
      <p>
        Arrow Blog es una plataforma web personal en desarrollo que permite a
        usuarios crear una cuenta y utilizar funcionalidades de la aplicación.
      </p>

      <h3>2. Obligaciones del usuario</h3>
      <ul>
        <li>Usar la plataforma de forma lícita y de buena fe.</li>
        <li>No vulnerar derechos de terceros.</li>
        <li>No intentar romper la seguridad o el funcionamiento del sitio.</li>
      </ul>

      <h3>3. Contenidos y conducta</h3>
      <p>
        Si el servicio permite publicar o introducir contenidos (p. ej. perfil,
        bio, etc.), el usuario es responsable de lo que publica y garantiza que
        dispone de los derechos necesarios.
      </p>

      <h3>4. Propiedad intelectual</h3>
      <p>
        El código, diseño y elementos del sitio pertenecen a su titular o se
        usan bajo licencias que lo permiten. No está permitido copiar o explotar
        el sitio con fines comerciales sin autorización.
      </p>

      <h3>5. Terminación</h3>
      <p>
        El usuario puede dejar de usar el servicio en cualquier momento. El
        titular puede suspender o cerrar cuentas ante incumplimientos, por
        seguridad o por mantenimiento del servicio.
      </p>

      <h3>6. Enlaces a terceros</h3>
      <p>
        El sitio puede incluir enlaces a terceros. El titular no controla dichos
        sitios ni asume responsabilidad por su contenido o políticas.
      </p>

      <h3>7. Modificaciones</h3>
      <p>
        El titular puede modificar estos términos para adaptarlos a cambios del
        servicio o requisitos legales. La versión vigente estará disponible en
        esta página.
      </p>

      <h3>8. Legislación aplicable</h3>
      <p>
        Estos términos se rigen por la legislación española. En caso de disputa,
        las partes se someterán a los juzgados y tribunales que correspondan
        conforme a la normativa aplicable.
      </p>
    </LegalLayout>
  );
}
