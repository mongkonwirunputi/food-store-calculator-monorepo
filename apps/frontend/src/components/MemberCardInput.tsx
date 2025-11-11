import './MemberCardInput.css';

interface MemberCardInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MemberCardInput({ value, onChange }: MemberCardInputProps) {
  return (
    <div className="member-card-input">
      <label htmlFor="memberCard">Member Card Number (Optional)</label>
      <input
        id="memberCard"
        type="text"
        placeholder="Enter member card number for 10% discount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="member-card-field"
      />
      {value && (
        <p className="member-card-hint">✨ You'll get 10% member discount!</p>
      )}
    </div>
  );
}

