package cn.wifiedu.esb.task;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;

import cn.wifiedu.esb.util.ClientUtilSim;

public class AndroidSocketTask implements Runnable {// socket 监听与发送事件常量
	private static final Logger logger = LoggerFactory.getLogger(AndroidSocketTask.class);
	// 设备控制
	public static final String TEACHER_SEND_EVENT_DEVICE_CONTROL = "teacher_send_event_device_control"; // 教师端请求设备控制
	public static final String TEACHER_SEND_EVENT_DEVICE_CONTROL_RESULT = "teacher_send_event_device_control_result"; // 教师端请求设备控制返回值
	public static final String STUDENT_RECEIVE_EVENT_DEVICE_CONTROL = "student_receive_event_device_control"; // 学生端接收请求设备控制

	// 教师端发送抢答题
	public static final String TEACHER_SEND_EVENT_PUBLISH_SINGLE = "teacher_send_event_publish_single"; // 教师端发送 //
																										// 发布抢答题目信息：包含试题信息，学生端显示
	public static final String TEACHER_SEND_EVENT_PUBLISH_SINGLE_RESULT = "teacher_send_event_publish_single_result";// 教师端发送发布抢答题目返回值
	public static final String STUDENT_REVEIVE_EVENT_PUBLISH_SINGLE = "student_reveive_event_publish_single"; // 学生端接收抢答题目的信息

	// 学生端发送抢答题的结果
	public static final String STUDENT_SEND_EVENT_ANSWER_SINGLE = "student_send_event_answer_single"; // 学生端发送答题结果
	public static final String STUDENT_SEND_EVENT_ANSWER_SINGLE_RESULT = "student_send_event_answer_single_result"; // 学生端发送答题结果的返回值
	public static final String TEACHER_RECEIVE_EVENT_ANSWER_SINGLE = "teacher_receive_event_answer_single"; // 教师接受学生答题结果


	public void run() {
		/**
		 * 创建Socket，并设置监听端口
		 */
		Configuration config = new Configuration();
		String ip = ClientUtilSim.getMyIp();
		logger.info("获取到的ip: "+ip);
		
		//设置主机名
		config.setHostname(ip);
		// 设置监听端口
		config.setPort(8089);
		/*
		 * config.setUpgradeTimeout(10000000); config.setPingTimeout(10000000);
		 * config.setPingInterval(10000000);
		 */
		final SocketIOServer server = new SocketIOServer(config);
		// server.getRoomOperations("").sendEvent("","");
		/**
		 * 添加连接监听事件，监听是否与客户端连接到服务器
		 */
		server.addConnectListener(new ConnectListener() {
			public void onConnect(SocketIOClient client) {
				// 判断是否有客户端连接
				if (client != null) {
					System.out.println("链接成功。。。");
					
				} else {
					System.err.println("并没有人链接上。。。");
				}
				System.err.println(client.getSessionId().toString());
			}
		});

		/**
		 * 添加监听事件，监听客户端的事件 1.第一个参数eventName需要与客户端的事件要一致 2.第二个参数eventClase是传输的数据类型
		 * 3.第三个参数listener是用于接收客户端传的数据，数据类型需要与eventClass一致
		 */
		// 监听教师发布设备控制
		server.addEventListener(TEACHER_SEND_EVENT_DEVICE_CONTROL, String.class, new DataListener<String>() {

			public void onData(SocketIOClient client, String data, AckRequest ackSender) throws Exception {
				// TODO Auto-generated method stub
				// 接收到教师的请求后，发送消息给学生，不让其退出
				System.err.println("接收到客户端的信息为：" + data);
				client.sendEvent(TEACHER_SEND_EVENT_DEVICE_CONTROL_RESULT, data); // 返回教师控制的状态
				// 发送给所有，后期优化
				server.getBroadcastOperations().sendEvent(STUDENT_RECEIVE_EVENT_DEVICE_CONTROL, data);

			}
		});

		// 监听教师发布抢答题
		server.addEventListener(TEACHER_SEND_EVENT_PUBLISH_SINGLE, String.class, new DataListener<String>() {

			public void onData(SocketIOClient client, String data, AckRequest ackSender) throws Exception {
				// TODO Auto-generated method stub

				client.sendEvent(TEACHER_SEND_EVENT_PUBLISH_SINGLE_RESULT, "true");
				// 发送给所有，后期优化
				server.getBroadcastOperations().sendEvent(STUDENT_REVEIVE_EVENT_PUBLISH_SINGLE, data);
			}
		});

		// 监听学生发送答题结果
		server.addEventListener(STUDENT_SEND_EVENT_ANSWER_SINGLE, String.class, new DataListener<String>() {

			public void onData(SocketIOClient client, String data, AckRequest ackSender) throws Exception {
				// TODO Auto-generated method stub
				System.out.println("data:"+data);
				client.sendEvent(STUDENT_SEND_EVENT_ANSWER_SINGLE_RESULT, "true");
//				// 发送给所有，后期优化
				server.getBroadcastOperations().sendEvent(TEACHER_RECEIVE_EVENT_ANSWER_SINGLE, data);
			}
		});

		// 启动服务
		server.start();
		
	}

}
