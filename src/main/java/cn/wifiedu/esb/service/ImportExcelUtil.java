package cn.wifiedu.esb.service;


import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


public class ImportExcelUtil {
	


	public List<List<Object>> readExcel(InputStream in) {
		List<List<Object>> excelDataList = new ArrayList<List<Object>>();
		try {
			// poi读取excel
			// 创建要读入的文件的输入流
			InputStream inp = in;
			// 根据上述创建的输入流 创建工作簿对象
			Workbook wb = WorkbookFactory.create(inp);
			// 得到第一页 sheet
			// 页Sheet是从0开始索引的
			Sheet sheet = wb.getSheetAt(0);
			int rowNum = sheet.getPhysicalNumberOfRows();
			for (int i = 0; i < rowNum; i++) {
				Row row = sheet.getRow(i);
				int colNum = row.getPhysicalNumberOfCells();
				
				List<Object> rowList = new ArrayList<Object>();
				
				for (int j = 0; j < colNum; j++) {
					Cell cell = row.getCell(j);
					rowList.add(getCellFormatValue(cell));
					// System.out.print(getCellFormatValue(cell)+"\t\t");
				}
				// System.out.println();
				 excelDataList.add(rowList);
				//GradeList.add(stuList);
			}
			// 关闭输入流
			inp.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return excelDataList;
	}

	
	
	private static String getCellFormatValue(Cell cell) {
		String cellvalue = "";
		if (cell != null) {
			// 判断当前Cell的Type
			switch (cell.getCellType()) {
			case HSSFCell.CELL_TYPE_NUMERIC:
				cellvalue = String.valueOf(cell.getNumericCellValue());
				if (HSSFDateUtil.isCellDateFormatted(cell)) {
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日");
					Date date = HSSFDateUtil.getJavaDate(cell.getNumericCellValue());
					cellvalue = sdf.format(date).toString();
				}
				break;
			case HSSFCell.CELL_TYPE_BOOLEAN:
				cellvalue = String.valueOf(cell.getBooleanCellValue());
				break;
			case HSSFCell.CELL_TYPE_BLANK:
				cellvalue = "";
				break;
			case HSSFCell.CELL_TYPE_FORMULA: {
				if (HSSFDateUtil.isCellDateFormatted(cell)) {
					Date date = cell.getDateCellValue();
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
					cellvalue = sdf.format(date);
				}
				else {
					cellvalue = String.valueOf(cell.getNumericCellValue());
				}
				break;
			}
			case HSSFCell.CELL_TYPE_STRING:
				cellvalue = cell.getRichStringCellValue().getString();
				break;
			default:
				cellvalue = "";
			}
		} else {
			cellvalue = "";
		}
		return cellvalue;
	}
 
	
	
	
}