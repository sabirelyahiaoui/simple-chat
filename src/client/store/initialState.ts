export default function getInitialState(): State {
  return {
    connection: "DISCONNECTED",
    messages: [],
    user: {
      name: getFromSessionStorageIfExists("username"),
      id: getFromSessionStorageIfExists("userId"),
    },
  };
}

function getFromSessionStorageIfExists(key: string): string | undefined {
  return window.sessionStorage.getItem(key) || undefined;
}
