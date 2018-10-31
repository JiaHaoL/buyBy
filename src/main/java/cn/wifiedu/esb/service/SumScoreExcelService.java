package cn.wifiedu.esb.service;


import java.io.File;
import java.io.FileOutputStream;
import java.util.Date;
import java.util.List;
import java.util.Map;














import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;


public class SumScoreExcelService {
	public String WriteExcel(List<Map<String, Object>> sumScoreList,List<Map<String, Object>> schoolExamStuList, String downName) {
		
	
		// 创建HSSFWorkbook对象(excel的文档对象)
		HSSFWorkbook wkb = new HSSFWorkbook();
		// 建立新的sheet对象（excel的表单）
		HSSFSheet sheet = wkb.createSheet("考生信息表");
		// 在sheet里创建第一行，参数为行索引(excel的行)，可以是0～65535之间的任何一个
		
		
		
		HSSFRow row1 = sheet.createRow(0);
		
		HSSFCell cell = row1.createCell(0);
		cell.setCellValue("学校");
		
		HSSFCell cell2 = row1.createCell(1);
		cell2.setCellValue("班级");
		
		HSSFCell cell3 = row1.createCell(2);
		cell3.setCellValue("姓名 ");
		
		HSSFCell cell4 = row1.createCell(3);
		cell4.setCellValue("考号");
		
		
		
		int index = 4;
	    for (int m=0;m < sumScoreList.size(); m++) {
	    	HSSFCell cellVo = row1.createCell(index);
	    	cellVo.setCellValue(MapToString(sumScoreList.get(m).get("SCORESUMNAME")));
	    	index++;
		}
		
	   /* HSSFCell cell5 = row1.createCell(index);
		cell5.setCellValue("总分");*/
		
		for (int i = 0; i < schoolExamStuList.size(); i++) {
		
				HSSFRow row2 = sheet.createRow(i+1);
				
				Map<String, Object> stuMap=schoolExamStuList.get(i);
				
				row2.createCell(0).setCellValue(MapToString(stuMap.get("SCHOOL")));
				row2.createCell(1).setCellValue(MapToString(stuMap.get("GRADECLASS")));
				row2.createCell(2).setCellValue(MapToString(stuMap.get("EXAMSTUNAME")));
				row2.createCell(3).setCellValue(MapToString(stuMap.get("EXAMINEENUMBER")));
				
				String[] nameList = MapToString(stuMap.get("SCORESUMNAME")).split(",");
				String[] scoreList = MapToString(stuMap.get("SCORE")).split(",");
				double SUMSCORE = 0;
				if(stuMap.get("SUMSCORE") != null){
					SUMSCORE = Double.parseDouble(""+stuMap.get("SUMSCORE"));
				}
				
				int rownum = 4;
				
				
			    for (int m=0;m < sumScoreList.size(); m++) {
			    	HSSFCell cellVo = row2.createCell(rownum);
			    	
			    	for (int j = 0; j < nameList.length && SUMSCORE > 0; j++) {
						if(row1.getCell(rownum).getStringCellValue().equals(nameList[j])){
							
							if(j<scoreList.length){
								cellVo.setCellValue(scoreList[j]);
								
							}
							
							break;
						}
					}
			    	
			    	rownum++;
			    	
				}
		}

		FileOutputStream fos;
		try {
			  String pathString =this.getClass().getClassLoader().getResource("").getPath().replace("/WEB-INF/classes/", "/assets/excel/");
			
			  File file= new File(pathString);
			  if  (!file.exists())      
			  {       
			      file.mkdir();
			  }
			  
			fos = new FileOutputStream(pathString+downName+".xls");
			
			wkb.write(fos);
			
			fos.close();
			
			//System.out.println(pathString+downName);
			
		} catch (Exception e) {
			
			e.printStackTrace();
		}
		
		
		return downName;
	}
	
	

	public String WriteExcel2(List<Map<String, Object>> sumScoreList,List<Map<String, Object>> schoolExamStuList, String downName) {
		
	
		// 创建HSSFWorkbook对象(excel的文档对象)
		HSSFWorkbook wkb = new HSSFWorkbook();
		// 建立新的sheet对象（excel的表单）
		HSSFSheet sheet = wkb.createSheet("考生信息表");
		// 在sheet里创建第一行，参数为行索引(excel的行)，可以是0～65535之间的任何一个
		
		
		
		HSSFRow row1 = sheet.createRow(0);
		
		HSSFCell cell = row1.createCell(0);
		cell.setCellValue("学校");
		
		HSSFCell cell2 = row1.createCell(1);
		cell2.setCellValue("班级");
		
		HSSFCell cell3 = row1.createCell(2);
		cell3.setCellValue("姓名 ");
		
	/*	HSSFCell cell5 = row1.createCell(4);
		cell5.setCellValue("");*/
		
		int index = 3;
	    for (int m=0;m < sumScoreList.size(); m++) {
	    	HSSFCell cellVo = row1.createCell(index);
	    	cellVo.setCellValue(MapToString(sumScoreList.get(m).get("SCORESUMNAME")));
	    	index++;
		}
	    
	    for (int m=0;m < sumScoreList.size(); m++) {
	    	HSSFCell cellVo = row1.createCell(index);
	    	cellVo.setCellValue(MapToString(sumScoreList.get(m).get("SCORESUMNAME"))+"分数");
	    	index++;
		}
	    
	    HSSFCell cell4 = row1.createCell(index);
		cell4.setCellValue("总分");
		
		
		for (int i = 0; i < schoolExamStuList.size(); i++) {
				HSSFRow row2 = sheet.createRow(i+1);
				Map<String, Object> stuMap=schoolExamStuList.get(i);
				
				row2.createCell(0).setCellValue(MapToString(stuMap.get("SCHOOL")));
				row2.createCell(1).setCellValue(MapToString(stuMap.get("GRADECLASS")));
				row2.createCell(2).setCellValue(MapToString(stuMap.get("EXAMSTUNAME")));
				
				
				String[] nameList = MapToString(stuMap.get("SCORESUMNAME")).split(",");
				String[] scoreList = MapToString(stuMap.get("SCORE")).split(",");
				String[] scoreDetailList = MapToString(stuMap.get("SCOREDETAIL")).split(",");
				double SUMSCORE = 0;
				if(stuMap.get("SUMSCORE") != null){
					SUMSCORE = Double.parseDouble(""+stuMap.get("SUMSCORE"));
				}
				
				int rownum = 3;
				
			    for (int m=0;m < sumScoreList.size(); m++) {
			    	HSSFCell cellVo = row2.createCell(rownum);
			    	for (int j = 0; j < nameList.length && SUMSCORE > 0; j++) {
						if(row1.getCell(rownum).getStringCellValue().equals(nameList[j])){
							if(j<scoreList.length){
								cellVo.setCellValue(scoreList[j]);
							}
							break;
						}
					}
			    	rownum++;
				}
			    
			    for (int m=0;m < sumScoreList.size(); m++) {
			    	HSSFCell cellVo = row2.createCell(rownum);
			    	for (int j = 0; j < nameList.length && SUMSCORE > 0; j++) {
						if(row1.getCell(rownum).getStringCellValue().equals(nameList[j]+"分数")){
							if(j<scoreDetailList.length){
								cellVo.setCellValue(toDouble(scoreDetailList[j]));
							}
							break;
						}
					}
			    	rownum++;
				}
			    row2.createCell(rownum).setCellValue(toDouble(stuMap.get("SUMSCORE")));
		}

		FileOutputStream fos;
		try {
			  String pathString =this.getClass().getClassLoader().getResource("").getPath().replace("/WEB-INF/classes/", "/assets/excel/");
			
			  File file= new File(pathString);
			  if  (!file.exists())      
			  {       
			      file.mkdir();
			  }
			  
			fos = new FileOutputStream(pathString+downName+".xls");
			
			wkb.write(fos);
			
			fos.close();
			
			//System.out.println(pathString+downName);
			
		} catch (Exception e) {
			
			e.printStackTrace();
		}
		
		
		return downName;
	}
	
	
	public String MapToString(Object obj) {
		  return obj==null?"":obj.toString();
	}
	
	public double toDouble(Object obj) {
		  return obj==null?0:Double.parseDouble(obj.toString());
	}
	
}
