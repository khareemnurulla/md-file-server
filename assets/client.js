(function() {
  'use strict';

  let eventSource;
  let reconnectTimeout;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 10;
  const reconnectDelay = 1000; // 1 second

  function connect() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource('/events');

    eventSource.onopen = function() {
      console.log('Live reload connected');
      reconnectAttempts = 0;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
    };

    eventSource.onmessage = function(event) {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'reload') {
          console.log('File changed, reloading page...');
          window.location.reload();
        } else if (data.type === 'connected') {
          console.log('Live reload ready');
        }
      } catch (error) {
        console.warn('Failed to parse live reload message:', error);
      }
    };

    eventSource.onerror = function(event) {
      console.warn('Live reload connection error');
      eventSource.close();
      
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        const delay = reconnectDelay * Math.pow(2, Math.min(reconnectAttempts - 1, 6));
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
        
        reconnectTimeout = setTimeout(() => {
          connect();
        }, delay);
      } else {
        console.error('Max reconnection attempts reached. Live reload disabled.');
      }
    };
  }

  // Start connection when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', connect);
  } else {
    connect();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
    if (eventSource) {
      eventSource.close();
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
  });

})();