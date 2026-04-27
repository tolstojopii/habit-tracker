import { useState } from "react";

const EditModal = (props) => {
  const { habit, onClose, onUpdateStyle } = props;

  const [fontFamily, setFontFamily] = useState(habit.fontFamily || "Arial");
  const [cardColor, setCardColor] = useState(habit.cardColor || "#1e1e3a");
  const [glowColor, setGlowColor] = useState(habit.glowColor || "#6a3bc0");

  const [step, setStep] = useState(0);

  const handleSave = () => {
    onUpdateStyle(habit.id, { fontFamily, cardColor, glowColor });
    onClose();
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderContent = () => {
    if (step === 0) {
      return (
        <div className="modal-step">
          <label>Выбери шрифт:</label>
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Impact">Impact</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
          </select>
        </div>
      );
    }
    if (step === 1) {
      return (
        <div className="modal-step">
          <label>цвет карточки:</label>
          <input
            type="color"
            value={cardColor}
            onChange={(e) => setCardColor(e.target.value)}
            className="color-picker"
          />
          <div
            className="color-preview"
            style={{ backgroundColor: cardColor, boxShadow: `0 0 15px ${cardColor}` }}
          />
        </div>
      );
    }
    if (step === 2) {
      return (
        <div className="modal-step">
          <label>Цвет свечения:</label>
          <input
            type="color"
            value={glowColor}
            onChange={(e) => setGlowColor(e.target.value)}
            className="color-picker"
          />
          <div
            className="glow-preview"
            style={{ boxShadow: `0 0 20px 5px ${glowColor}` }}
          />
        </div>
      );
    }
    return null;
  };   // ← ЗДЕСЬ ТОЛЬКО ОДНА СКОБКА (закрывает renderContent)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {step > 0 && (
          <button className="modal-arrow modal-arrow-left" onClick={prevStep}>
            ◀
          </button>
        )}
        <h3>Настройки карточки</h3>
        {renderContent()}
        <div className="step-indicators">
          <span className={`step-dot ${step === 0 ? "active" : ""}`} />
          <span className={`step-dot ${step === 1 ? "active" : ""}`} />
          <span className={`step-dot ${step === 2 ? "active" : ""}`} />
        </div>
        <div className="modal-buttons">
          <button className="modal_cancel_btn" onClick={onClose}>
            Отмена
          </button>
          {step < 2 ? (
            <button className="modal_next_btn" onClick={nextStep}>
              Далее ▶
            </button>
          ) : (
            <button className="modal_save_btn" onClick={handleSave}>
              Сохранить 💾
            </button>
          )}
        </div>
        {step < 2 && (
          <button className="modal-arrow modal-arrow-right" onClick={nextStep}>
            ▶
          </button>
        )}
      </div>
    </div>
  );
};

export default EditModal;



  /* return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Настройка шрифта</h3>
        <div className="arrows">
          <button className="left">⭠</button>
          <button className="right">⭢</button>
        </div>
        
        <label>Шрифт:</label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Impact">Impact</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Monaco">Monaco</option>
          <option value="Tahoma">Tahoma</option>
        </select>

        <div className="modal-buttons">
          <button className="modal_save_btn" onClick={handleSave}>
            Сохранить
          </button>
          <button className="modal_cancel_btn" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}; */