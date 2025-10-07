export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePassword(password) {
    // Минимум 8 символов, хотя бы одна буква и одна цифра
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

export function validateServerHost(host) {
    // Простая валидация hostname или IP
    const hostnameRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

    return hostnameRegex.test(host) || ipRegex.test(host);
}

export function validatePort(port) {
    const portNum = parseInt(port);
    return !isNaN(portNum) && portNum > 0 && portNum <= 65535;
}
