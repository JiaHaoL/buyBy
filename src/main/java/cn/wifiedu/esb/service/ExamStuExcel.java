package cn.wifiedu.esb.service;


import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;


public class ExamStuExcel {
	public String WriteExcel(List<Map<String, Object>> ExamStuList, List<Map<String, Object>> scoreSumList, String downName) {
		
	
		// 创建HSSFWorkbook对象(excel的文档对象)
		HSSFWorkbook wkb = new HSSFWorkbook();
		// 建立新的sheet对象（excel的表单）
		HSSFSheet sheet = wkb.createSheet("考生信息表");
		// 在sheet里创建第一行，参数为行索引(excel的行)，可以是0～65535之间的任何一个
		
		
		
		HSSFRow row1 = sheet.createRow(0);
		
		HSSFCell cell = row1.createCell(0);
		cell.setCellValue("考生ID");
		
		HSSFCell cell2 = row1.createCell(1);
		cell2.setCellValue("班级");
		
		HSSFCell cell3 = row1.createCell(2);
		cell3.setCellValue("班内序号 ");
		
		HSSFCell cell4 = row1.createCell(3);
		cell4.setCellValue("姓名");
		
		for (int i = 0; i < scoreSumList.size(); i++) {
			String SCORESUMNAME = scoreSumList.get(i).get("SCORESUMNAME").toString();
			HSSFCell cell5 = row1.createCell(i+4);
			cell5.setCellValue(SCORESUMNAME);
		}
		
		
		
		for (int i = 0; i < ExamStuList.size(); i++) {
				HSSFRow row2 = sheet.createRow(i+1);
				Map<String, Object> stuMap=ExamStuList.get(i);
				
				row2.createCell(0).setCellValue(MapToString(stuMap.get("EXAMSTUID")));
				row2.createCell(1).setCellValue(MapToString(stuMap.get("GRADECLASS")));
				row2.createCell(2).setCellValue(MapToString(stuMap.get("XH")));
				row2.createCell(3).setCellValue(MapToString(stuMap.get("EXAMSTUNAME")));
		}

		FileOutputStream fos;
		try {
			  String pathString =this.getClass().getClassLoader().getResource("").getPath().replace("/WEB-INF/classes/", "/assets/excel/");
			  //System.out.println(pathString);
			  File file= new File(pathString);
			  if  (!file.exists())      
			  {       
			      file.mkdir();
			  }
			  
			fos = new FileOutputStream(pathString+downName+".xls");
			
			wkb.write(fos);
			
			fos.close();
			
		} catch (Exception e) {
			
			e.printStackTrace();
		}
		
		
		return downName;
	}
	
	
	public String MapToString(Object obj) {
		
		  return obj==null?"":obj.toString();

	}
	
}
