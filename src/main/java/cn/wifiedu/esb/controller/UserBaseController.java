package cn.wifiedu.esb.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import cn.wifiedu.core.controller.BaseController;
import cn.wifiedu.core.service.OpenService;
import cn.wifiedu.core.vo.ExceptionVo;
import cn.wifiedu.esb.util.ClientUtilSim;

@Controller  
@Scope("prototype")
public class UserBaseController extends BaseController{  

	@Resource
	OpenService openService;

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}

	/**
	 * 获取教师所教年级和学科
	 */
	@ResponseBody
    @RequestMapping("/TeacherInfo_getTeacherClassLesson_data")
	public void getTeacherClassLesson() {
		try {
			Map<String, Object> map = getParameterMap();
			
			map.put("sqlMapId", "getTeacherClassList");
			List<Map<String, Object>> list = openService.queryForList(map);
			for(int i=0;i<list.size();i++) {
				map.put("CLASS_PK", list.get(i).get("CLASS_PK").toString());
				map.put("sqlMapId", "getTeacherLessonList");
				List<Map<String, Object>> lessonList = openService.queryForList(map);
				list.get(i).put("LESSON_INFO", lessonList);
			}
			output("0000",list);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 获取左侧章节树
	 */
	@ResponseBody
    @RequestMapping("/TeacherInfo_getSubjcetTree_data")
	public void getSubjcetTree() {
		try {
			Map<String, Object> map = getParameterMap();
			
			String classId = map.get("CLASS_PK").toString();
			String lessonId = map.get("LESSON_PK").toString();
			
			//校验是否存在本地文件
			//获取请求路径
			String absPath = request.getSession().getServletContext().getRealPath("/");
			System.out.println("project path:"+absPath);
			String fileName = absPath + "assets//json//" + classId + "_" + lessonId +".json";
			String redirectUrl = request.getScheme() //当前链接使用的协议
				    +"://" + request.getServerName()//服务器地址
				    + ":" + request.getServerPort() //端口号
				    + request.getContextPath() + "/assets/json/" + classId + "_" + lessonId +".json";
			
			//校验是否存在该学段下学科的文件
			File file=new File(fileName);
			System.out.println("redirectUrl: " + redirectUrl);
			
			if(file.exists()) {
				System.out.println(fileName + " is exists");
				response.sendRedirect(redirectUrl);
			}else {
				System.out.println(fileName + " is not exists");
				
				//根据CLASS_PK获取FK_DICTIONARY_GRADE
				//根据LESSON_PK获取FK_SUBJECT
				map.put("sqlMapId", "getGradeSubjectParams");
				Map<String, Object> paramsMap = (Map<String, Object>) openService.queryForObject(map);
				
				String url = ClientUtilSim.getPath("sc_tree_chapter");
				url = url.replace("grade", paramsMap.get("FK_DICTIONARY_GRADE").toString()).replace("subject", paramsMap.get("FK_SUBJECT").toString());
				String urlContent = ClientUtilSim.get(url);
				
				
				Object succesResponse = JSON.parse(urlContent);    //先转换成Object
				Map<String, Object> contentMap = (Map<String, Object>)succesResponse;         //Object强转换为Map
				
				String data = contentMap.get("data").toString();
				data = data.replace("NODE_ID", "G_ID").replace("NODE_ISLEAF", "G_ISLEAF").replace("NODE_PID", "G_PID").replace("NODE_TEXT", "G_NODE_TEXT");
				
				List<Map<String, Object>> list = ClientUtilSim.toListMap(data);
				List<Map<String, Object>> returnList = new ArrayList<Map<String,Object>>();
				List<Map<String, Object>> copyReturnList = new ArrayList<Map<String,Object>>();
				for(int i=0;i<list.size();i++) {
					if(list.get(i).get("G_PID").toString().equals("0") ||list.get(i).get("G_ISLEAF").toString().equals("1")) {
						returnList.add(list.get(i));
					}
				}

				for(int i=0; i<returnList.size();i++) {
					String nodeId = returnList.get(i).get("G_ID").toString();
					List<Map<String, Object>> tempList = new ArrayList<Map<String,Object>>();
					for(int j=0; j<list.size();j++) {
						if(list.get(j).get("G_PID").toString().equals(nodeId)) {
							tempList.add(list.get(j));
						}
					}
					returnList.get(i).put("NODE", tempList);
				}
				
				for(int i=0; i<returnList.size();i++) {
					List<Map<String, Object>> nodeList = ClientUtilSim.toListMap(returnList.get(i).get("NODE").toString());
					for(int j=0; j< nodeList.size();j++) {
						String nodeId = nodeId = nodeList.get(j).get("G_ID").toString();
						List<Map<String, Object>> twoTempList = new ArrayList<Map<String,Object>>();
						for(int k=0; k<list.size(); k++) {
							if(nodeId.equals(list.get(k).get("G_PID").toString())) {
								twoTempList.add(list.get(k));
							}
						}
						nodeList.get(j).put("NODE", twoTempList);
					}
					returnList.get(i).put("NODE", nodeList);
				}
				
				//创建文件
				JSONObject json = new JSONObject();
				json.put("data", returnList);
				json.put("code", "0000");
				file = new File(fileName);
				file.createNewFile();
				System.out.println("success create file: "+fileName);
				writeFileContent(fileName, json.toJSONString());
				response.sendRedirect(redirectUrl);
			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 获取教师左侧树目录
	 * CLASS_PK
	 * LESSON_PK
	 */
	@ResponseBody
    @RequestMapping("/TeacherInfo_getLeftTree_data")
	public void getTeacherTree() {
		try {
			Map<String, Object> map = getParameterMap();
			
			//改用本地文件方式存储数据
			//学科校验
			String lessonName = null;
			if(map.containsKey("LESSON_PK")) {
				map.put("sqlMapId", "getLessonNameByLessonPK");
				Map<String, Object> lessonMap = (Map<String, Object>) openService.queryForObject(map);
				lessonName = LessonCheck(lessonMap.get("LESSONCHNAME").toString());
			}
			
			//判断班级学段
			map.put("sqlMapId", "getClassLevel");
			Map<String, Object> classMap = (Map<String, Object>) openService.queryForObject(map);
			String GID = getClassLevelGID(classMap.get("GRADE_YEAR_LEVEL").toString());
			String gardeLevel = classMap.get("GRADE_YEAR_LEVEL").toString();
			
			//获取请求路径
			String absPath = request.getSession().getServletContext().getRealPath("/");
			System.out.println("project path:"+absPath);
			String fileName = absPath + "assets//json//" + gardeLevel + "_" + map.get("LESSON_PK").toString() +".json";
			String redirectUrl = request.getScheme() //当前链接使用的协议
				    +"://" + request.getServerName()//服务器地址
				    + ":" + request.getServerPort() //端口号
				    + request.getContextPath() + "/assets/json/" + gardeLevel + "_" + map.get("LESSON_PK").toString() +".json";
			
			//校验是否存在该学段下学科的文件
			File file=new File(fileName);
			System.out.println("redirectUrl: " + redirectUrl);
			if(file.exists()) {
				System.out.println(fileName + " is exists");
				response.sendRedirect(redirectUrl);
			}else {
				System.out.println(fileName + " is not exists");
				
				//查询树
				map.put("sqlMapId", "getTreeRes");
				map.put("G_ID", GID);
				map.put("lessonName", lessonName);
				List<Map<String, Object>> treeList = getRes(map);
				JSONObject json = new JSONObject();
				json.put("data", treeList);
				json.put("code", "0000");
				//JSONObject jsonRes = new JSONObject();
				//jsonRes.put("data", json);
				//创建文件
				file = new File(fileName);
				file.createNewFile();
				System.out.println("success create file: "+fileName);
				writeFileContent(fileName, json.toJSONString());
				response.sendRedirect(redirectUrl);
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 递归查询树
	 * @return
	 */
	public List<Map<String, Object>> getRes(Map<String, Object> map){
		List<Map<String, Object>> treeList = null;
		try {
			treeList = openService.queryForList(map);
			if(treeList.size() > 0) {
				for(int i=0;i<treeList.size();i++) {
					map.put("G_ID", treeList.get(i).get("G_ID").toString());
					map.put("lessonName", "");
					treeList.get(i).put("NODE", getRes(map));
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return treeList;
	}
	
	/**
	 * 部分学科名称转换
	 * @param lessonName
	 * @return
	 */
	public String LessonCheck(String lessonName) {
		if(lessonName.equals("英语")) {
			lessonName = "外语";
		}
		return lessonName;
	}
	
	/**
	 * 获取班级学段的GID
	 * @return
	 */
	public String getClassLevelGID(String classLevel) {
		if(classLevel.equals("0")) {
			return null;
		}else if(classLevel.equals("1")) {
			return "ff8080811c9875e7011c9892bd0d000b";
		}else if(classLevel.equals("2")) {
			return "ff8080811c9875e7011c9892deca000c";
		}else if(classLevel.equals("3")) {
			return "ff8080811c98a246011c98c68baa0006";
		}else {
			return null;
		}
	}
	
	/**
     * 向文件中写入内容
     * @param filepath 文件路径与名称
     * @param newstr  写入的内容
     * @return
     * @throws IOException
     */
    public static boolean writeFileContent(String filepath,String newstr) throws IOException{
        Boolean bool = false;
        String filein = newstr+"\r\n";//新写入的行，换行
        String temp  = "";
        
        FileInputStream fis = null;
        InputStreamReader isr = null;
        BufferedReader br = null;
        FileOutputStream fos  = null;
        PrintWriter pw = null;
        try {
            File file = new File(filepath);//文件路径(包括文件名称)
            //将文件读入输入流
            fis = new FileInputStream(file);
            isr = new InputStreamReader(fis);
            br = new BufferedReader(isr);
            StringBuffer buffer = new StringBuffer();
            
            //文件原有内容
            for(int i=0;(temp =br.readLine())!=null;i++){
                buffer.append(temp);
                // 行与行之间的分隔符 相当于“\n”
                buffer = buffer.append(System.getProperty("line.separator"));
            }
            buffer.append(filein);
            
            fos = new FileOutputStream(file);
            pw = new PrintWriter(fos);
            pw.write(buffer.toString().toCharArray());
            pw.flush();
            bool = true;
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
        }finally {
            //不要忘记关闭
            if (pw != null) {
                pw.close();
            }
            if (fos != null) {
                fos.close();
            }
            if (br != null) {
                br.close();
            }
            if (isr != null) {
                isr.close();
            }
            if (fis != null) {
                fis.close();
            }
        }
        return bool;
    }
    
  
	
}
