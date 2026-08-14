import { getProgressPercent } from "../../utils/formatters";

const ProgressBar = ({ raised, goal, className = "", showPercent = true }) => {
  const percent = getProgressPercent(raised, goal);
  return (
    <div className={`w-full ${className}`}>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showPercent && (
        <span className="text-xs text-neutral-500 mt-1 block">{percent}% funded</span>
      )}
    </div>
  );
};

export default ProgressBar;
