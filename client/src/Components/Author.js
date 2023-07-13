import { formatDate } from '../utils';

export default function Author({ author }) {
  return (
    <div className="author-info">
      <h2>{author.username}</h2>
      <img
        style={{
          borderWidth: '5px',
          borderColor: author.role === 'admin' ? 'crimson' : 'teal',
          borderStyle: 'solid',
        }}
        src={`http://192.168.1.203:8000/userPhotos/user_${author.id}.jpg`}
        alt={`User ${author.username}`}
      />
      <h3>{[author.status, author.role].join(' ')} </h3>
      <h5>Joined {formatDate(author.created_at, { dateStyle: 'medium' })}</h5>
    </div>
  );
}
