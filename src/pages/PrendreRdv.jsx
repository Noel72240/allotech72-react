import PageLayout from '../components/PageLayout.jsx'
import Contact from '../components/Contact.jsx'
import config from '../config.js'

export default function PrendreRdv() {
  return (
    <PageLayout
      title="Prendre rendez-vous — dépannage informatique Sarthe"
      description={`Réservez un créneau avec ${config.prenom} (${config.brand}). Rappel rapide, diagnostic gratuit. ${config.telephone}`}
    >
      <div className="rdv-page">
        <div className="container" style={{ textAlign: 'center', marginBottom: 8 }}>
          <p className="rdv-page__lead">
            Indiquez un créneau souhaité — {config.prenom} vous confirme rapidement.
            Le plus direct : <a href={`tel:${config.telBrut}`}>{config.telephone}</a>.
          </p>
          <p className="rdv-page__hours">{config.horaires} · {config.delai}</p>
        </div>
        <Contact
          variant="rdv"
          subtitle="Décrivez le souci et un horaire qui vous arrange."
        />
      </div>
    </PageLayout>
  )
}
