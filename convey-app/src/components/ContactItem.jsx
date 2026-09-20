import ProfileAvatar from './ProfileAvatar'

export default function ContactItem({ contact, registered, onAction }) {
  return (
    <div className="contact-item">
      <ProfileAvatar src={contact.profilePhotoUrl} name={contact.name} />
      <div className="contact-item__info">
        <div className="contact-item__name">{contact.name}</div>
        <div className="contact-item__status">{contact.about || contact.phoneNumber}</div>
      </div>
      <button
        className={`contact-item__action ${registered ? 'contact-item__action--message' : 'contact-item__action--invite'}`}
        onClick={onAction}
      >
        {registered ? 'Message' : 'Invite'}
      </button>
    </div>
  )
}
