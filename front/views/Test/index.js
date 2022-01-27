import styled from "styled-components";
import React from "react";

export default function Test() {
  const [server, setserver] = React.useState("");
  const [connected, setconnected] = React.useState(false);
  const [To, setTo] = React.useState("");
  const [ListUsers, setListUsers] = React.useState([]);
  const [messages, Setmessages] = React.useState([]);
  const [from, setfrom] = React.useState("");
  const [OpenDocs, setOpenDocs] = React.useState(false);
  const [trigger, settrigger] = React.useState(false);
  const [portswitcher, setportswitcher] = React.useState(false);
  const form = React.useRef();

  const updateMessage = async (tox) => {
    const x = await fetch(
      `${
        portswitcher != false && portswitcher != true ? "http://localhost:" : ""
      }${
        portswitcher != false && portswitcher != true ? portswitcher : server
      }/${tox}`,
      {
        method: "GET",
        // headers: {
        //   "Content-Type": "Application/json",
        //   "Access-Control-Allow-Origin": "*",
        //   "Access-Control-Allow-Headers":
        //     "Origin, X-Requested-With, Content-Type, Accept",
        // },
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data;
      });

    if (x.length > 0) {
      let w = x.map((element) => {
        return {
          m: element,
          f: "to",
        };
      });

      Setmessages([...messages, ...w]);
      window.setTimeout(() => {
        var element = document.getElementById("chat");
        element.scrollTop = element.scrollHeight - element.clientHeight;
      }, 1000);
    }
  };

  const updateusers = async (fromx) => {
    const x = await fetch(
      `${
        portswitcher != false && portswitcher != true ? "http://localhost:" : ""
      }${
        portswitcher != false && portswitcher != true ? portswitcher : server
      }/users`,
      {
        method: "GET",
        // headers: {
        //   "Content-Type": "Application/json",
        //   "Access-Control-Allow-Origin": "*",
        //   "Access-Control-Allow-Headers":
        //     "Origin, X-Requested-With, Content-Type, Accept",
        // },
      }
    )
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        return data;
      });
    console.log(x);

    setListUsers(x.filter((user) => user.name != fromx));
  };

  const register = async (e) => {
    console.log(portswitcher);
    const x = await fetch(
      `${
        portswitcher != false && portswitcher != true ? "http://localhost:" : ""
      }${
        portswitcher != false && portswitcher != true ? portswitcher : server
      }/login`,
      {
        method: "POST",
        // headers: {
        //   "Content-Type": "Application/json",
        //   "Access-Control-Allow-Origin": "*",
        //   "Access-Control-Allow-Headers":
        //     "Origin, X-Requested-With, Content-Type, Accept",
        // },
        body: JSON.stringify({
          name: e.target[0].value,
          port:
            portswitcher != false && portswitcher != true
              ? portswitcher
              : server === "server1"
              ? 8005
              : 8692,
          host: "localhost",
        }),
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data;
      });
    setfrom(e.target[0].value);
    let w = x.users.filter((user) => user.name != e.target[0].value);
    setListUsers(w);
    if (w[0]) setTo(w[0].name);
    setconnected(true);
    window.setTimeout(() => {
      window.onbeforeunload =  (e)=> {
        e = e || window.event;
        e.preventDefault();
        logout();

        e.returnValue = '';
      
      
        // For IE and Firefox prior to version 4
        if (e) {
            e.returnValue = 'Sure?';
        }
    
        // For Safari
        return 'Sure?';
    };
    }, 200);
  };

  const loop = (To, messages, from, trigger) => {
    if (To != "") setTimeout(updateMessage, 2000, To, messages);
    if (from != "") setTimeout(updateusers, 2000, from);

    setTimeout(settrigger, 2000, !trigger);
  };
  React.useEffect(() => {
    loop(To, messages, from, trigger);
  }, [trigger]);

  const SendMessage = async (e) => {
    Setmessages([
      ...messages,
      {
        m: e.target[0].value,
        f: "me",
      },
    ]);
    const x = await fetch(
      `${
        portswitcher != false && portswitcher != true ? "http://localhost:" : ""
      }${
        portswitcher != false && portswitcher != true ? portswitcher : server
      }/chat/${To}`,
      {
        method: "POST",
        // headers: {
        //   "Content-Type": "Application/json",
        //   "Access-Control-Allow-Origin": "*",
        //   "Access-Control-Allow-Headers":
        //     "Origin, X-Requested-With, Content-Type, Accept",
        // },
        body: e.target[0].value,
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data;
      });

    form.current.reset();
  };

  const logout = async () => {
    setserver("");
    setconnected(false);
    setTo("");
    setListUsers([]);
    Setmessages([]);
    setfrom("");
    setOpenDocs(false);
    settrigger(false);
    setportswitcher(false);
    const x = await fetch(`${portswitcher != false && portswitcher != true ? "http://localhost:" : ""}${portswitcher != false && portswitcher != true ? portswitcher : server}/${from}`,
      {
        method: "DELETE",
      }
    );
  };
  return (
    <main data-template="Test" className="center">
      <article className="cover center">
        <div className="OpenDocsContainer">
          <div
            className="OpenDocs"
            onClick={() => {
              setOpenDocs(!OpenDocs);
            }}
          >
            OpenClientDocs
          </div>
        </div>
        <div className={`Docs ${OpenDocs ? "Open" : ""}`}>
          <div className="Title">GET /ping</div>
          <p>
            * Cette route n'attend aucun paramètre. * Cette route retourne rien.
          </p>
          ***
          <div className="Title">GET /users</div>
          <p>
            * Cette route n'attend aucun paramètre. * Cette route retourne un
            tableau contenant tous les utilisateurs actuellement connectés au
            serveur de registre.
          </p>
          ***
          <div className="Title">GET /all</div>
          <p>
            * Cette route n'attend aucun paramètre. * Cette route retourne un
            tableau contenant tous les messages actuellement enregistrés en
            mémoire sur le client, chaque clé de tableau correspond à
            l'utilisateur émetteur du message.
          </p>
          ***
          <div className="Title">GET /"user"</div>
          <p>
            * Cette route attend un paramètre sous forme de `string` dans l'URL
            correspondant au nom de l'utilisateur dont on souhaite récupérer les
            messages. * Cette route retourne un tableau contenant les messages
            émis par l'utilisateur ciblé.
          </p>
          ***
          <div className="Title">POST /login</div>
          <p>
            * Cette route attend en paramètre du body un `object` contenant les
            valeurs `string` `name`, `string` `host` et `string` `port`. * Cette
            route retourne un `object` contenant le message de succès ou
            d'échec, un `string` contenant le pseudo de l'utilisateur s'étant
            connecté ainsi que la liste des utilisateurs actuellement connectés
            au serveur de registre. * Cette route peut renvoyer une erreur 500
            si le `body` de la requête est invalide ou si l'utilisateur qui
            tente de se connecter est déjà connecté au serveur de registre.
          </p>
          ***
          <div className="Title">POST /chat/"user"</div>
          <p>
            * Cette route attend un paramètre sous forme de `string` dans l'URL
            correspondant au nom de l'utilisateur à qui le message doit être
            envoyé ainsi que le message en `plaintext` dans le `body` de la
            requête. * Cette route retourne un `object` contenant le message de
            succès ou d'échec. * Cette route peut renvoyer une erreur 404 si
            l'utilisateur ciblé par l'envoi n'est pas connecté au serveur de
            registre ou si l'utilisateur qui tente l'envoi n'est pas connecté au
            serveur de registre.
          </p>
          ***
          <div className="Title">DELETE /logout</div>
          <p>
            * Cette route attend aucun paramètre. * Cette route retourne un
            `object` contenant le message de succès ou d'échec, ainsi que la
            liste des utilisateurs actuellement connectés au serveur de
            registre. * Cette route peut renvoyer une erreur 404 si
            l'utilisateur ciblé n'est pas connecté au serveur de registre.
          </p>
          ***
        </div>
      </article>
      <section>
        {!server && !connected && (
          <div className="cover center">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (e.target[0].value != "") {
                  setserver(e.target[0].value);

                  if (e.target[1].value != "") {
                    setportswitcher(parseInt(e.target[1].value));
                  } else {
                    setportswitcher(false);
                  }
                }
              }}
            >
              <h1>Server</h1>
              <select
                name="pets"
                id="pets"
                className="uppercase centered__text"
                onChange={(e) => {
                  let x = document.querySelector("#pets").value;
                  if (x === "write") {
                    setportswitcher(true);
                  } else {
                    setportswitcher(false);
                  }
                }}
              >
                <option value="">--Please choose an server--</option>
                <option value="write">Write Port</option>
                <option value="server1">Server 1</option>
                <option value="server2">Server 2</option>
              </select>
              {portswitcher && (
                <input
                  className="uppercase centered__text"
                  type="number"
                ></input>
              )}

              <button>Envoyer</button>
            </form>
          </div>
        )}
        {server && !connected && (
          <div className="cover center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                register(e);
              }}
            >
              <h1>UserName</h1>
              <input className="uppercase centered__text"></input>
              <button>Envoyer</button>
            </form>
          </div>
        )}
        {server && connected && (
          <>
            <button
              style={{
                background: "red",
                maxWidth: "200px",
                position: "absolute",
                right: "2rem",
                top: "2rem",
              }}
              onClick={() => {
                logout();
              }}
            >
              Logout
            </button>
            <div className="cover center relative ">
              <div className="ListUser cover center relative">
                {ListUsers.map((element) => {
                  return (
                    <span
                      className={To === element.name ? "selected" : ""}
                      onClick={() => {
                        Setmessages([]);

                        setTo(element.name);
                      }}
                    >
                      {element.name}
                    </span>
                  );
                })}
              </div>
              <div className="delimit cover center relative FlexColumn">
                <Chat className="Cha relativet" id="chat">
                  {messages.map((element, i) => {
                    return (
                      <div
                        className={` ${element.f === "me" ? "Me" : "To"} s`}
                        key={i}
                      >
                        {element.m}
                      </div>
                    );
                  })}
                </Chat>
                <form
                  ref={form}
                  className="container fitcontent-h"
                  onSubmit={(e) => {
                    e.preventDefault();

                    SendMessage(e);
                  }}
                >
                  <input></input>
                  <button>Envoyer</button>
                </form>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
const Chat = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  padding: 3rem;
  height: 100%;
  width: 100%;
  row-gap: 2rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;
