package com.xjy.op.service;

import com.xjy.op.dao.CoordinationDao;
import com.xjy.op.dao.FileDao;
import com.xjy.op.dto.CoordinationDto;
import com.xjy.op.dto.FileDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoordinationService {

    @Autowired
    private CoordinationDao coordinationDao;

    public CoordinationDto getCoordinationById(int id){
        return coordinationDao.getCoordinationById(id);
    }

    public CoordinationDto getCoordinationBySpaceIdAndFileId(int spaceId, int fileId){
        return coordinationDao.getCoordinationBySpaceIdAndFileId(spaceId, fileId);
    }
}
