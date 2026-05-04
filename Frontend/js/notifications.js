const NOTIFICATION_API = "http://127.0.0.1:8000/api/notifications/";

export const NotificationService = {
    async requestPermission() {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return false;
        }

        if (Notification.permission === "granted") {
            return true;
        }

        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        }

        return false;
    },

    async send(title, options = {}) {
        if (Notification.permission === "granted") {
            const notification = new Notification(title, {
                icon: "../img/logo.png",
                ...options
            });

            // Save notification to backend
            try {
                await fetch(NOTIFICATION_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: `${title}: ${options.body || ''}`,
                        is_read: false
                    })
                });
            } catch (error) {
                console.error("Failed to sync notification with backend", error);
            }

            return notification;
        }
    },

    async getNotifications() {
        try {
            const response = await fetch(NOTIFICATION_API);
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch notifications", error);
            return [];
        }
    },

    checkDeadlines(tasks) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        tasks.forEach(task => {
            if (task.status !== 'Completed' && task.date) {
                const deadline = new Date(task.date);
                deadline.setHours(0, 0, 0, 0);
                
                const diffTime = deadline - today;
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 0 && diffDays <= 1) {
                    const message = diffDays === 0 ? "due today!" : "due tomorrow!";
                    const storageKey = `notified_deadline_${task.id}_${today.toDateString()}`;
                    
                    if (!localStorage.getItem(storageKey)) {
                        this.send("Deadline Reminder ⏳", {
                            body: `Task "${task.title}" is ${message}`,
                            tag: `deadline_${task.id}`,
                            requireInteraction: true
                        });
                        localStorage.setItem(storageKey, "true");
                    }
                }
            }
        });
    },

    async initDropdown() {
        const bell = document.getElementById("notificationBell");
        if (!bell) return;

        // Create dropdown element
        const dropdown = document.createElement("div");
        dropdown.className = "notification-dropdown";
        dropdown.id = "notifDropdown";
        dropdown.innerHTML = `
            <div class="notif-header">
                <h3>Notifications</h3>
                <a href="#" class="clear-all" id="clearNotifs">Clear All</a>
            </div>
            <div class="notif-list" id="notifList"></div>
        `;
        bell.parentElement.appendChild(dropdown);

        bell.addEventListener("click", (e) => {
            e.preventDefault();
            dropdown.classList.toggle("active");
            if (dropdown.classList.contains("active")) {
                this.renderDropdown();
            }
        });

        document.addEventListener("click", (e) => {
            if (!bell.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove("active");
            }
        });

        document.getElementById("clearNotifs").addEventListener("click", async (e) => {
            e.preventDefault();
            // In a real app, we'd call a DELETE API. 
            // For now, we'll just clear locally and refresh
            const notifs = await this.getNotifications();
            for (const n of notifs) {
                await fetch(`${NOTIFICATION_API}${n.id}/`, { method: 'DELETE' });
            }
            this.renderDropdown();
            // Update counts in global scope if available
            if (window.updateNotificationCount) window.updateNotificationCount();
        });
    },

    async renderDropdown() {
        const list = document.getElementById("notifList");
        if (!list) return;

        const notifications = await this.getNotifications();
        list.innerHTML = "";

        if (notifications.length === 0) {
            list.innerHTML = `<div class="empty-notif">No new notifications</div>`;
            return;
        }

        notifications.forEach(n => {
            const item = document.createElement("div");
            item.className = `notif-item ${n.is_read ? '' : 'unread'}`;
            item.innerHTML = `
                <p>${n.message}</p>
                <span>${new Date(n.created_at).toLocaleString()}</span>
            `;
            list.appendChild(item);
        });
    }
};
