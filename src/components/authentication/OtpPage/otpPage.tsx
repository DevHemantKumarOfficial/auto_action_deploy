import "./otpPage.css";

type InputProps = {
  length?: number;
  otp: string[];
  setOtp: (otp: string[]) => void;
  onComplete: (pin: string) => void;
};

const OtpPage = ({ length = 4, otp, setOtp, onComplete }: InputProps) => {
  const handleTextChange = (input: string, index: number) => {
    // Ensure only numeric values are allowed
    if (!/^\d*$/.test(input)) return;

    const newOtp = [...otp];
    newOtp[index] = input;
    setOtp(newOtp);

    // Automatically focus on the next input field if user enters a digit
    if (input.length === 1 && index < length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }

    // Focus on the previous input field if user clears a digit
    if (input.length === 0 && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }

    // Call onComplete if all digits are entered
    onComplete(newOtp.join(''));
  };

  return (
    <div className={`grid grid-cols-${length} d-flex justify-content-center`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleTextChange(e.target.value, index)}
          id={`otp-input-${index}`}
          className="border border-solid outline-none otp-boxes"
          style={{ marginRight: index === length - 1 ? '0' : '10px', textAlign: 'center' }}
        />
      ))}
    </div>
  );
};

export default OtpPage;
