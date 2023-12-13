const apiUrl = '';
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const timerDisplay = document.getElementById('timer-display');
const timeRange = document.getElementById('time-range');
const selectedTimeDisplay = document.getElementById('selected-time');

let timerInterval;
let group;
// 获取地址参数中的group名
const queryParams = new URLSearchParams(window.location.search);
if (queryParams.get('group')) {
    group = queryParams.get('group');
} else {
    group = "default";
}

// 更新倒计时显示
function updateTimerDisplay(timeLeft) {
    if (timeLeft < 0) {
        timeLeft = 0;
    }
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 同步番茄钟状态
function syncTimer() {
    fetch(`${apiUrl}/get_timer/${group}`)
        .then(response => response.json())
        .then(data => {
            if (data.end_time) {
                const endTime = new Date(data.end_time);
                const now = new Date();
                const timeLeft = Math.round((endTime - now) / 1000);
                updateTimerDisplay(timeLeft);
            } else {
                updateTimerDisplay(0);
            }
        });
}

// 启动番茄钟
function startTimer() {
    const duration = parseInt(timeRange.value) * 60; // 转换为秒
    const endTime = new Date(new Date().getTime() + duration * 1000);

    fetch(`${apiUrl}/start_timer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            group: group,
            end_time: endTime.toISOString(),
            is_running: true,
        }),
    });

    syncTimer();
}

// 终止番茄钟
function stopTimer() {
    fetch(`${apiUrl}/stop_timer/${group}`, { method: 'POST' });
    // updateTimerDisplay(parseInt(timeRange.value) * 60);
    updateTimerDisplay(0);
}

// 时间周期选择器变化事件
timeRange.addEventListener('input', () => {
    selectedTimeDisplay.textContent = `${timeRange.value} Minutes`;
    // updateTimerDisplay(parseInt(timeRange.value) * 60);
});

// 启动按钮点击事件
startButton.addEventListener('click', startTimer);

// 终止按钮点击事件
stopButton.addEventListener('click', stopTimer);

// 页面加载时同步一次
syncTimer();

// 每秒刷新显示
timerInterval = setInterval(() => {
    syncTimer();
}, 1000);
