let currentUser = null;

export function setCurrentUser(user) {
  currentUser = user;
  sessionStorage.setItem('currentUser', JSON.stringify(user));
}

export function getCurrentUser() {
  if (!currentUser) {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  }
  return currentUser
}

export function formatPaidDate(isoDate) {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;

  return `${formattedDay}.${formattedMonth}.${year}`;
}
