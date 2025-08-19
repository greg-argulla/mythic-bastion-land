import { useEffect, useState } from "react";
import styles from "./App.module.css";
import classNames from "classnames";
import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import axios from "axios";

type Chat = {
  id: number;
  user: string;
  message: string;
  title?: string;
  description?: string;
};

const setMetadata = (metadata: Metadata) => {
  const metadataWithDate = {
    ...metadata,
    "grimwild.date.extension/metadata": Date.now(),
  };
  OBR.scene.setMetadata(metadataWithDate);
};

const ChatInstance = ({ chat, name }: { chat: Chat; name: string }) => {
  return (
    <div style={{ textAlign: chat.user === name ? "right" : "left" }}>
      <div className={styles.chatSender}>{chat.user}</div>
      <span>{chat.message}</span>
      {chat.description && (
        <div dangerouslySetInnerHTML={{ __html: chat.description }} />
      )}
    </div>
  );
};

function App() {
  const [isOBRReady, setIsOBRReady] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [role, setRole] = useState<string>("PLAYER");
  const [chat, setChat] = useState<Chat[]>([]);
  const [chatToCheckChanges, setChatToCheckChanges] = useState<Chat[]>([]);
  const [myChat, setMyChat] = useState<Chat[]>([]);
  const [cookiesNotEnabled, setCookiesNotEnabled] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const createChatArray = async (metadata: Metadata) => {
    const metadataGet = metadata[
      "mythicbastionland.extension/metadata"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as Record<string, any>;
    let messages: Chat[] = [];

    const playerId = await OBR.player.getId();
    setId(playerId);

    if (metadataGet) {
      const keys = Object.keys(metadataGet);

      keys.forEach((key) => {
        messages = messages.concat(metadataGet[key]);
        if (key === playerId) {
          setMyChat(metadataGet[key]);
        }
      });
    }
    return messages.sort((a, b) => a.id - b.id);
  };

  useEffect(() => {
    OBR.onReady(async () => {
      OBR.scene.onReadyChange(async (ready) => {
        if (ready) {
          const metadata = await OBR.scene.getMetadata();

          if (metadata["mythicbastionland.extension/metadata"]) {
            const currentChat = await createChatArray(metadata);
            setChatToCheckChanges(currentChat);
          }

          setIsOBRReady(true);
          setTimeout(() => {
            const objDiv = document.getElementById("chatbox");
            if (objDiv) {
              objDiv.scrollTop = objDiv.scrollHeight;
            }
          }, 100);

          OBR.action.setBadgeBackgroundColor("orange");
          setName(await OBR.player.getName());
          setId(await OBR.player.getId());

          OBR.player.onChange(async () => {
            setName(await OBR.player.getName());
          });

          setRole(await OBR.player.getRole());
        } else {
          setIsOBRReady(false);
          setChat([]);
        }
      });

      if (await OBR.scene.isReady()) {
        const metadata = await OBR.scene.getMetadata();

        if (metadata["mythicbastionland.extension/metadata"]) {
          const currentChat = await createChatArray(metadata);
          setChatToCheckChanges(currentChat);
        }

        setIsOBRReady(true);
        setTimeout(() => {
          const objDiv = document.getElementById("chatbox");
          if (objDiv) {
            objDiv.scrollTop = objDiv.scrollHeight;
          }
        }, 100);

        OBR.action.setBadgeBackgroundColor("orange");
        setName(await OBR.player.getName());
        setId(await OBR.player.getId());

        OBR.player.onChange(async () => {
          setName(await OBR.player.getName());
        });

        setRole(await OBR.player.getRole());
      }
    });

    try {
      localStorage.getItem("mythicbastionland.extension/rolldata");
    } catch {
      setCookiesNotEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (chatToCheckChanges.length !== chat.length) {
      setChat(chatToCheckChanges);
      setTimeout(() => {
        const objDiv = document.getElementById("chatbox");
        if (objDiv) {
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      }, 100);
    }
  }, [chatToCheckChanges]);

  useEffect(() => {
    if (isOBRReady) {
      OBR.scene.onMetadataChange(async (metadata) => {
        const currentChat = await createChatArray(metadata);
        setChatToCheckChanges(currentChat);
      });

      OBR.action.onOpenChange(async (isOpen) => {
        // React to the action opening or closing
        if (isOpen) {
          setUnreadCount(0);
        }
      });

      try {
        localStorage.getItem("mythicbastionland.extension/rolldata");
      } catch {
        setCookiesNotEnabled(true);
        return;
      }
    }
  }, [isOBRReady]);

  useEffect(() => {
    if (unreadCount > 0) {
      OBR.action.setBadgeText("" + unreadCount);
    } else OBR.action.setBadgeText(undefined);
  }, [unreadCount, isOBRReady]);

  useEffect(() => {
    const updateMessages = async () => {
      const lastMessage = chat[chat.length - 1];

      if (lastMessage && isOBRReady) {
        if (isOBRReady) {
          const isOpen = await OBR.action.isOpen();
          if (!isOpen) {
            setUnreadCount(unreadCount + 1);
          }
        }
      }
    };

    if (isOBRReady) {
      updateMessages();
    }
  }, [chat]);

  const addMessage = async (message?: string) => {
    if (text !== "") {
      if (role === "GM") {
        if (text === "/clearchat") {
          clearChat();
          setText("");
          return;
        }
      }

      const newMessage = {
        id: Date.now(),
        user: message ? "Seer" : role === "GM" ? "GM" : name,
        message: message ? message.trim() : text.trim(),
      };
      const newChat = [...myChat, newMessage];

      const metadataGet = await OBR.scene.getMetadata();
      const metadata = metadataGet[
        "mythicbastionland.extension/metadata"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as Record<string, any>;

      const metadataChange = { ...metadata };
      metadataChange[id] = newChat;

      setMetadata({
        "mythicbastionland.extension/metadata": metadataChange,
      });

      setText("");

      setTimeout(() => {
        const objDiv = document.getElementById("chatbox");
        if (objDiv) {
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      }, 100);
    }
  };

  const clearChat = async () => {
    const metadataGet = await OBR.scene.getMetadata();
    const metadata = metadataGet[
      "mythicbastionland.extension/metadata"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as Record<string, any>;
    const keys = Object.keys(metadata);

    const clearedMetaData = { ...metadata };

    keys.forEach((key) => {
      clearedMetaData[key] = [];
    });

    setMetadata({
      "mythicbastionland.extension/metadata": clearedMetaData,
    });
  };

  if (cookiesNotEnabled) {
    return "Cookies not enabled";
  }

  if (!isOBRReady) {
    return (
      <div className={styles.global}>
        <div className={classNames(styles.scrollable, styles.Sheet)}>
          <div className={styles.header}>No Scene found.</div>
          <div>
            You need to load a scene to start adding/updating characters. If a
            scene is already loaded, kindly refresh the page.
          </div>
        </div>
      </div>
    );
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addMessage();
    }
  };

  const askTheSeer = async () => {
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          system_instruction: {
            parts: [
              {
                text: "You are a fantasy writer, If I give you a description, alter it to make it concise and evocative. If I give you a question, answer as if you are the Oracle of mythical land. Please limit it to one paragraph.",
              },
            ],
          },
          contents: [
            {
              parts: [{ text: text }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": import.meta.env.VITE_SECRET_KEY,
          },
        }
      );

      addMessage(response.data.candidates[0].content.parts[0].text);
      setText("");
    } catch {
      addMessage("The Seer stays silent.");
    }
  };

  return (
    <div className={styles.global}>
      <img className={styles.oath} src={"./assets/Seek.png"} alt="paper" />
      <hr className={styles.line} />
      <div className={styles.scrollable}>
        <div id="chatbox" className={classNames(styles.chatScrollable)}>
          {chat.length
            ? chat
                .sort((a, b) => a.id - b.id)
                .map((chat) => (
                  <ChatInstance chat={chat} key={chat.id} name={name} />
                ))
            : ""}
        </div>
        <hr className={styles.line} />
        <div className={styles.chatFieldContainer}>
          <input
            className={styles.chatField}
            value={text}
            onChange={(evt) => {
              setText(evt.target.value);
            }}
            onKeyDown={(e) => {
              handleKeyDown(e);
            }}
            style={{
              width: role === "GM" ? "320px" : "440px",
            }}
          ></input>
          {role === "GM" && (
            <button onClick={askTheSeer} className={styles.button}>
              Ask the Seer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
