#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Цвета для консоли
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    bold: '\x1b[1m',
};

const { green, red, yellow, blue, cyan, gray, bold, reset } = colors;

// Правильная структура проекта
const expectedStructure = {
    files: [
        'package.json',
        '.env.example',
        'next.config.js',
        'tailwind.config.js',
        'postcss.config.js',
        'middleware.js',
    ],
    optional: [
        '.env.local',
        '.gitignore',
        'README.md',
        'Dockerfile',
        'docker-compose.yml',
        'nginx.conf',
        'ecosystem.config.js',
    ],
    directories: {
        'pages': {
            files: ['_app.js', 'index.js', 'login.js', 'dashboard.js'],
            dirs: {
                'api': {
                    dirs: {
                        'auth': {
                            files: ['[...nextauth].js', 'register.js']
                        },
                        'users': {
                            files: ['index.js', '[id].js']
                        },
                        'servers': {
                            files: ['index.js', '[id].js']
                        },
                        'stats': {
                            files: ['activity.js']
                        }
                    },
                    files: ['stats.js']
                },
                'admin': {
                    files: ['users.js', 'activity.js', 'settings.js']
                },
                'servers': {
                    files: ['index.js']
                }
            }
        },
        'components': {
            files: ['Layout.js', 'Modal.js', 'Toast.js', 'StatCard.js']
        },
        'models': {
            files: ['User.js', 'Server.js', 'Connection.js']
        },
        'lib': {
            files: ['mongodb.js']
        },
        'utils': {
            files: ['api.js', 'formatters.js', 'validators.js', 'notifications.js']
        },
        'hooks': {
            files: ['useToast.js']
        },
        'scripts': {
            files: ['createAdmin.js', 'seedServers.js', 'deploy.sh']
        },
        'styles': {
            files: ['globals.css']
        },
        'public': {
            optional: true
        }
    }
};

// Проверка существования файла/папки
function exists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (err) {
        return false;
    }
}

// Проверка структуры
function checkStructure(basePath = '.', structure = expectedStructure, level = 0) {
    const results = {
        total: 0,
        found: 0,
        missing: [],
        extra: [],
    };

    const indent = '  '.repeat(level);

    // Проверка файлов
    if (structure.files) {
        structure.files.forEach(file => {
            results.total++;
            const filePath = path.join(basePath, file);
            if (exists(filePath)) {
                results.found++;
                console.log(`${indent}${green}✓${reset} ${file}`);
            } else {
                results.missing.push(filePath);
                console.log(`${indent}${red}✗${reset} ${red}${file}${reset} ${gray}(отсутствует)${reset}`);
            }
        });
    }

    // Проверка опциональных файлов
    if (structure.optional) {
        structure.optional.forEach(file => {
            const filePath = path.join(basePath, file);
            if (exists(filePath)) {
                console.log(`${indent}${cyan}○${reset} ${file} ${gray}(опционально)${reset}`);
            } else {
                console.log(`${indent}${gray}○ ${file} (опционально, отсутствует)${reset}`);
            }
        });
    }

    // Проверка директорий
    if (structure.directories) {
        Object.keys(structure.directories).forEach(dir => {
            const dirPath = path.join(basePath, dir);
            const dirStructure = structure.directories[dir];

            console.log(`${indent}${blue}📁 ${dir}/${reset}`);

            if (exists(dirPath)) {
                results.found++;

                // Рекурсивная проверка содержимого директории
                if (dirStructure.files || dirStructure.dirs) {
                    const subResults = checkStructure(dirPath, dirStructure, level + 1);
                    results.total += subResults.total;
                    results.found += subResults.found;
                    results.missing.push(...subResults.missing);
                }
            } else {
                results.total++;
                if (!dirStructure.optional) {
                    results.missing.push(dirPath);
                    console.log(`${indent}  ${red}✗ Директория отсутствует${reset}`);
                } else {
                    console.log(`${indent}  ${gray}○ Опциональная директория отсутствует${reset}`);
                }
            }
        });
    }

    return results;
}

// Генерация дерева файлов
function generateTree(dir, prefix = '', isLast = true) {
    const items = fs.readdirSync(dir);
    const filteredItems = items.filter(item => {
        // Игнорируем определенные папки
        return !['node_modules', '.next', '.git', 'coverage'].includes(item);
    });

    filteredItems.forEach((item, index) => {
        const itemPath = path.join(dir, item);
        const isLastItem = index === filteredItems.length - 1;
        const stats = fs.statSync(itemPath);

        const connector = isLastItem ? '└── ' : '├── ';
        const icon = stats.isDirectory() ? '📁' : '📄';

        console.log(`${prefix}${connector}${icon} ${item}`);

        if (stats.isDirectory()) {
            const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
            generateTree(itemPath, newPrefix, isLastItem);
        }
    });
}

// Проверка package.json зависимостей
function checkDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    if (!exists(packageJsonPath)) {
        console.log(`${red}✗ package.json не найден!${reset}\n`);
        return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    const requiredDeps = {
        'next': '^14.0.0',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'next-auth': '^4.24.0',
        'mongoose': '^8.0.0',
        'bcryptjs': '^2.4.3',
        'axios': '^1.6.0',
        'tailwindcss': '^3.3.5',
    };

    console.log(`\n${bold}${blue}=== Проверка зависимостей ===${reset}\n`);

    let allFound = true;
    Object.keys(requiredDeps).forEach(dep => {
        if (deps[dep]) {
            console.log(`${green}✓${reset} ${dep} ${gray}(${deps[dep]})${reset}`);
        } else {
            console.log(`${red}✗${reset} ${dep} ${gray}(отсутствует)${reset}`);
            allFound = false;
        }
    });

    if (!allFound) {
        console.log(`\n${yellow}⚠ Установи недостающие зависимости:${reset}`);
        console.log(`${cyan}npm install${reset}\n`);
    }
}

// Проверка .env файлов
function checkEnvFiles() {
    console.log(`\n${bold}${blue}=== Проверка Environment Variables ===${reset}\n`);

    const envExample = exists('.env.example');
    const envLocal = exists('.env.local');

    if (envExample) {
        console.log(`${green}✓${reset} .env.example найден`);
    } else {
        console.log(`${yellow}⚠${reset} .env.example не найден`);
    }

    if (envLocal) {
        console.log(`${green}✓${reset} .env.local найден`);

        // Проверяем основные переменные
        const envContent = fs.readFileSync('.env.local', 'utf8');
        const requiredVars = [
            'MONGODB_URI',
            'NEXTAUTH_SECRET',
            'NEXTAUTH_URL',
            'JWT_SECRET'
        ];

        console.log(`\n${gray}Проверка переменных:${reset}`);
        requiredVars.forEach(varName => {
            if (envContent.includes(varName)) {
                console.log(`  ${green}✓${reset} ${varName}`);
            } else {
                console.log(`  ${red}✗${reset} ${varName} ${gray}(отсутствует)${reset}`);
            }
        });
    } else {
        console.log(`${red}✗${reset} .env.local не найден`);
        console.log(`\n${yellow}⚠ Создай .env.local файл:${reset}`);
        console.log(`${cyan}cp .env.example .env.local${reset}\n`);
    }
}

// Главная функция
function main() {
    console.clear();
    console.log(`${bold}${cyan}
╔═══════════════════════════════════════════════╗
║   🛡️  goidaProxy - Проверка структуры проекта  ║
╚═══════════════════════════════════════════════╝
${reset}\n`);

    console.log(`${bold}${blue}=== Структура проекта ===${reset}\n`);

    const results = checkStructure();

    console.log(`\n${bold}${blue}=== Статистика ===${reset}\n`);
    console.log(`Всего файлов/папок: ${bold}${results.total}${reset}`);
    console.log(`Найдено: ${green}${results.found}${reset}`);
    console.log(`Отсутствует: ${results.missing.length > 0 ? red : green}${results.missing.length}${reset}`);

    if (results.missing.length > 0) {
        console.log(`\n${yellow}⚠ Отсутствующие файлы:${reset}`);
        results.missing.forEach(file => {
            console.log(`  ${red}✗${reset} ${file}`);
        });
    }

    // Проверка зависимостей
    checkDependencies();

    // Проверка .env
    checkEnvFiles();

    // Дерево проекта
    console.log(`\n${bold}${blue}=== Дерево проекта ===${reset}\n`);
    console.log(`${bold}📁 goidaproxy-admin/${reset}`);
    try {
        generateTree('.', '', true);
    } catch (err) {
        console.log(`${red}Ошибка при генерации дерева: ${err.message}${reset}`);
    }

    // Итоговый вердикт
    console.log(`\n${bold}${blue}=== Итоговый результат ===${reset}\n`);

    const percentage = Math.round((results.found / results.total) * 100);

    if (percentage === 100) {
        console.log(`${green}${bold}✓ Структура проекта идеальна! (${percentage}%)${reset}`);
        console.log(`${green}Можно запускать проект!${reset}\n`);
    } else if (percentage >= 80) {
        console.log(`${yellow}⚠ Структура почти готова (${percentage}%)${reset}`);
        console.log(`${yellow}Создай недостающие файлы и можно стартовать${reset}\n`);
    } else if (percentage >= 50) {
        console.log(`${yellow}⚠ Структура неполная (${percentage}%)${reset}`);
        console.log(`${yellow}Нужно добавить обязательные файлы${reset}\n`);
    } else {
        console.log(`${red}✗ Структура сильно отличается (${percentage}%)${reset}`);
        console.log(`${red}Проверь что все файлы на месте${reset}\n`);
    }

    // Следующие шаги
    console.log(`${bold}${cyan}=== Следующие шаги ===${reset}\n`);

    if (!exists('.env.local')) {
        console.log(`1. ${yellow}Создай .env.local:${reset}`);
        console.log(`   ${cyan}cp .env.example .env.local${reset}\n`);
    }

    if (!exists('node_modules')) {
        console.log(`2. ${yellow}Установи зависимости:${reset}`);
        console.log(`   ${cyan}npm install${reset}\n`);
    }

    console.log(`3. ${yellow}Создай админа:${reset}`);
    console.log(`   ${cyan}node scripts/createAdmin.js${reset}\n`);

    console.log(`4. ${yellow}Запусти проект:${reset}`);
    console.log(`   ${cyan}npm run dev${reset}\n`);

    console.log(`${gray}Подробная документация в README.md${reset}\n`);
}

// Запуск
main();