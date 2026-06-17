import './Loader.css';

export default function Loader({ size = 'md', text = 'Loading...' }) {
  return (
    <div className={`loader loader--${size}`}>
      <div className="loader__drops">
        <div className="loader__drop" />
        <div className="loader__drop" />
        <div className="loader__drop" />
      </div>
      {text && <p className="loader__text">{text}</p>}
    </div>
  );
}
