package cn.wifiedu.esb.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DatabaseUtil {
	private static final Logger logger =LoggerFactory.getLogger(DatabaseUtil.class);
	
	private Connection conn = null;  
	private PreparedStatement pst = null; 
	
	private DatabaseUtil() {};
	private DatabaseUtil(String url,String drive,String user,String password) throws ClassNotFoundException, SQLException  {
		Class.forName(drive);//指定连接类型  
        conn = DriverManager.getConnection(url, user, password);//获取连接  
	};
	
	public boolean execSql(String sql) {
		boolean result = false;
		try {  
			pst = conn.prepareStatement(sql);//准备执行语句
			result = pst.execute();
			conn.commit();
        } catch (Exception e) {  
        	logger.error(e.getLocalizedMessage());
        }
        return result;
	}
	
	public ResultSet selectSql(String sql) {
		ResultSet ret = null;
		try {  
			pst = conn.prepareStatement(sql);//准备执行语句
			ret = pst.executeQuery();
        } catch (Exception e) {  
        	logger.error(e.getLocalizedMessage());
        }
		return ret;
	}
	
	public void close() {
		try {  
			conn.close(); 
            pst.close(); 
        } catch (Exception e) {  
        	logger.error(e.getLocalizedMessage());
        }
	}
	 
	public static DatabaseUtil getDatabase(String url,String drive,String user,String password) {  
		DatabaseUtil database = null;
        try {  
        	logger.debug("url",url);
        	logger.debug("drive",drive);
        	logger.debug("user",user);
        	logger.debug("password",password);
        	database = new DatabaseUtil(url, drive, user, password);
        } catch (Exception e) { 
        	logger.error("getDatabase Fail",e);
        }
        return database;
    }   
	
}
