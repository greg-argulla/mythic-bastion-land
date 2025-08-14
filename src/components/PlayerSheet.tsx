import React, { useRef, useEffect } from "react";
import styles from "../App.module.css";

export type Player = {
  id: number;
  name: string;
  knight?: string;
  property?: string;
  ability?: string;
  passion?: string;
  currentVigor?: number;
  currentClarity?: number;
  currentSpirit?: number;
  currentGuard?: number;
  currentArmor?: number;
  currentGlory?: number;
  maxVigor?: number;
  maxClarity?: number;
  maxSpirit?: number;
  maxGuard?: number;
  maxArmor?: number;
};

interface PlayerSheetProps {
  player: Player;
  onPlayerChange: (player: Player) => void;
}

const TextArea = ({
  label,
  onChange,
  rows = 1,
  value,
  width = 200,
}: {
  label: string;
  onChange: (value: string) => void;
  rows?: number;
  value: string;
  width?: number;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set height to scrollHeight to fit content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldLabel}>{label}</div>
      <textarea
        ref={textareaRef}
        className={styles.field}
        style={{
          width: width,
          minHeight: `${rows * 1.2}em`,
          resize: "none",
          overflow: "hidden",
        }}
        rows={rows}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        value={value}
      ></textarea>
    </div>
  );
};

const PlayerSheet: React.FC<PlayerSheetProps> = ({
  player,
  onPlayerChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className={styles.container}>
        <img src={"./assets/Seek.png"} alt="paper" width={400} />
      </div>

      <div className={styles.containerFlex}>
        <div className={styles.container}>
          <TextArea
            label="Name"
            onChange={(value) => {
              onPlayerChange({ ...player, name: value });
            }}
            value={player.name}
            width={280}
          />
          <TextArea
            label={"Property"}
            onChange={(value) => {
              onPlayerChange({ ...player, property: value });
            }}
            value={player.property || ""}
            width={280}
          ></TextArea>
          <TextArea
            label={"Ability"}
            onChange={(value) => {
              onPlayerChange({ ...player, ability: value });
            }}
            value={player.ability || ""}
            width={280}
          ></TextArea>
          <TextArea
            label={"Passion"}
            onChange={(value) => {
              onPlayerChange({ ...player, passion: value });
            }}
            value={player.passion || ""}
            width={280}
          ></TextArea>
        </div>
        <div className={styles.diceContainer}>
          <img
            src={"./assets/dice-area.jpg"}
            alt="paper"
            height={400}
            width={140}
          />
          <div className={styles.diceContainerRow}>
            <input
              type="text"
              aria-label="VIG"
              style={{
                position: "absolute",
                top: "76px",
                left: "17px",
                width: "32px",
                height: "32px",
                textAlign: "center",
              }}
              value={player.currentVigor || ""}
              onChange={(e) => {
                onPlayerChange({
                  ...player,
                  currentVigor: parseInt(e.target.value),
                });
              }}
            />
            <input
              type="text"
              aria-label="CLA"
              style={{
                position: "absolute",
                top: "121px",
                left: "17px",
                width: "32px",
                height: "32px",
                textAlign: "center",
              }}
              value={player.currentClarity || ""}
              onChange={(e) => {
                onPlayerChange({
                  ...player,
                  currentClarity: parseInt(e.target.value),
                });
              }}
            />
            <input
              type="text"
              aria-label="SPI"
              style={{
                position: "absolute",
                top: "166px",
                left: "17px",
                width: "32px",
                height: "32px",
                textAlign: "center",
              }}
              value={player.currentSpirit || ""}
              onChange={(e) => {
                onPlayerChange({
                  ...player,
                  currentSpirit: parseInt(e.target.value),
                });
              }}
            />
            <input
              type="text"
              aria-label="GD"
              style={{
                position: "absolute",
                top: "212px",
                left: "17px",
                width: "32px",
                height: "32px",
                textAlign: "center",
              }}
              value={player.currentGuard || ""}
              onChange={(e) => {
                onPlayerChange({
                  ...player,
                  currentGuard: parseInt(e.target.value),
                });
              }}
            />
            <input
              type="text"
              aria-label="A"
              style={{
                position: "absolute",
                top: "258px",
                left: "17px",
                width: "32px",
                height: "32px",
                textAlign: "center",
              }}
              value={player.currentArmor || ""}
              onChange={(e) => {
                onPlayerChange({
                  ...player,
                  currentArmor: parseInt(e.target.value),
                });
              }}
            />

            <input
              type="text"
              aria-label="VIG"
              style={{
                position: "absolute",
                top: "76px",
                left: "90px",
                width: "32px",
                height: "32px",
                borderRadius: "100%",
                textAlign: "center",
              }}
              value={player.maxVigor || ""}
              onChange={(e) => {
                onPlayerChange({
                  ...player,
                  maxVigor: parseInt(e.target.value),
                });
              }}
            />

            <input
              type="text"
              aria-label="CLA"
              style={{
                position: "absolute",
                top: "121px",
                left: "90px",
                width: "32px",
                height: "32px",
                borderRadius: "100%",
                textAlign: "center",
              }}
              value={player.maxClarity || ""}
              onChange={(e) => {
                onPlayerChange({
                  ...player,
                  maxClarity: parseInt(e.target.value),
                });
              }}
            />

            <input
              type="text"
              aria-label="SPI"
              style={{
                position: "absolute",
                top: "167px",
                left: "90px",
                width: "32px",
                height: "32px",
                borderRadius: "100%",
                textAlign: "center",
              }}
              value={player.maxSpirit || ""}
              onChange={(e) => {
                onPlayerChange({
                  ...player,
                  maxSpirit: parseInt(e.target.value),
                });
              }}
            />

            <input
              type="text"
              aria-label="GD"
              style={{
                position: "absolute",
                top: "213px",
                left: "90px",
                width: "32px",
                height: "32px",
                borderRadius: "100%",
                textAlign: "center",
              }}
              value={player.maxGuard || ""}
              onChange={(e) => {
                onPlayerChange({
                  ...player,
                  maxGuard: parseInt(e.target.value),
                });
              }}
            />

            <input
              type="text"
              aria-label="maxArmor"
              style={{
                position: "absolute",
                top: "259px",
                left: "90px",
                width: "32px",
                height: "32px",
                borderRadius: "100%",
                textAlign: "center",
              }}
              value={player.maxArmor || ""}
              onChange={(e) => {
                onPlayerChange({
                  ...player,
                  maxArmor: parseInt(e.target.value),
                });
              }}
            />

            <input
              type="text"
              aria-label="glory"
              style={{
                position: "absolute",
                top: "346px",
                left: "47px",
                width: "44px",
                height: "44px",
                borderRadius: "100%",
                textAlign: "center",
                fontSize: "18px",
              }}
            />

            <input
              type="checkbox"
              aria-label="fatigued"
              style={{
                position: "absolute",
                top: "308px",
                left: "8px",
                width: "20px",
                height: "20px",
                borderRadius: "100%",
                textAlign: "center",
                fontSize: "18px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerSheet;
