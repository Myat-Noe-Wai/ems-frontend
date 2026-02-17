let timeout;
let warningTimeout;

const SESSION_LIMIT = 15 * 60 * 1000; // 2 minutes
const WARNING_TIME = 60 * 1000; // show warning 1 min before logout

export const startSessionTimer = (logoutCallback, warningCallback) => {
  resetTimer(logoutCallback, warningCallback);

  ["mousemove", "keydown", "click", "scroll"].forEach(event =>
    window.addEventListener(event, () => resetTimer(logoutCallback, warningCallback))
  );
};

export const resetTimer = (logoutCallback, warningCallback) => {
  if (timeout) clearTimeout(timeout);
  if (warningTimeout) clearTimeout(warningTimeout);

  // warning popup 60 seconds before auto logout
  warningTimeout = setTimeout(() => {
    warningCallback();
  }, SESSION_LIMIT - WARNING_TIME);

  // auto logout
  timeout = setTimeout(() => {
    logoutCallback();
  }, SESSION_LIMIT);
};

export const stopSessionTimer = () => {
  if (timeout) clearTimeout(timeout);
  if (warningTimeout) clearTimeout(warningTimeout);
};
