package com.xjy.op.service;

import com.xjy.op.dao.DocumentDao;
import com.xjy.op.dto.DocumentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentService {
    @Autowired
    private DocumentDao documentDao;

    /**
     * 创建一个文档
     * @param name 文档的名字
     * @param spaceId 空间的id
     * @return 创建的文档的id
     */
    public int createDocument(String name, int spaceId){
        return documentDao.createDocument(name, spaceId);
    }

    /**
     * 通过文件的id来获取一个文档
     * @param fileId 文件的id
     * @return 获取到的文件
     */
    public DocumentDto getDocumentByFileId(int fileId) {
        return documentDao.getDocumentByFileId(fileId);
    }

    /**
     * 保存修改的文档
     * @param fileId 文件id
     * @param content 文件的内容
     * @return 保存是否成功
     */
    public boolean saveDocumentByFileId(int fileId, String content){
        return documentDao.saveDocumentByFileId(fileId,content);
    }
}
