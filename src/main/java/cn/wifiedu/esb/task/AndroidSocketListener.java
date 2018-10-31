package cn.wifiedu.esb.task;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class AndroidSocketListener implements ServletContextListener {

	/**
	 * 监听开始销毁
	 */
	public void contextDestroyed(ServletContextEvent sce) {
		System.out.println("contextDestroyed");
	}

/**  
* 监听开始执行  
*/  
public void contextInitialized(ServletContextEvent sce) {  
	AndroidSocketTask androidSocketTask=new AndroidSocketTask();
	Thread thread=new Thread(androidSocketTask);
	thread.start();
	}
}
