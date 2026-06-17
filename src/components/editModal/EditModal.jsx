import { useState } from "react";
import styles from "./editModal.module.css";

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
        <div className={styles.step}>
          <label className={styles.label}>Выбери шрифт:</label>
          <select className={styles.select} value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
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
        <div className={styles.step}>
          <label className={styles.label}>цвет карточки:</label>
          <input
            type="color"
            className={styles.colorPicker}
            value={cardColor}
            onChange={(e) => setCardColor(e.target.value)}
          />
          <div
            className={styles.colorPreview}
            style={{ backgroundColor: cardColor, boxShadow: `0 0 15px ${cardColor}` }}
          />
        </div>
      );
    }
    if (step === 2) {
      return (
        <div className={styles.step}>
          <label className={styles.label}>Цвет свечения:</label>
          <input
            type="color"
            className={styles.colorPicker}
            value={glowColor}
            onChange={(e) => setGlowColor(e.target.value)}
          />
          <div
            className={styles.glowPreview}
            style={{ boxShadow: `0 0 20px 5px ${glowColor}` }}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {step > 0 && (
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prevStep}>
            ◀
          </button>
        )}
        <h3 className={styles.title}>Настройки карточки</h3>
        {renderContent()}
        <div className={styles.indicators}>
          <span className={`${styles.dot} ${step === 0 ? styles.active : ""}`} />
          <span className={`${styles.dot} ${step === 1 ? styles.active : ""}`} />
          <span className={`${styles.dot} ${step === 2 ? styles.active : ""}`} />
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Отмена
          </button>
          {step < 2 ? (
            <button className={styles.nextBtn} onClick={nextStep}>
              Далее ▶
            </button>
          ) : (
            <button className={styles.saveBtn} onClick={handleSave}>
              Сохранить 💾
            </button>
          )}
        </div>
        {step < 2 && (
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={nextStep}>
            ▶
          </button>
        )}
      </div>
    </div>
  );
};

export default EditModal;