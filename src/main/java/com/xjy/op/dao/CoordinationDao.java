package com.xjy.op.dao;


import com.xjy.op.dto.CoordinationDto;
import com.xjy.op.dto.FileDto;
import com.xjy.op.web.command.FileCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CoordinationDao {

    //通过id获取文件
    public CoordinationDto getCoordinationById(int id) {
        return jdbcTemplate.queryForObject(
                "select * from op_coordination where id=?",
                new Object[]{id},
                new CoordinationMapper()
        );
    }

    //通过spaceId和fileId查询coordination
    public CoordinationDto getCoordinationBySpaceIdAndFileId(int spaceId, int fileId){
        return jdbcTemplate.queryForObject(
                "select * from op_coordination where spaceId=? and fileId=?",
                new Object[]{spaceId,fileId},
                new CoordinationMapper()
        );
    }

    private final class CoordinationMapper implements RowMapper<CoordinationDto> {
        @Override
        public CoordinationDto mapRow(ResultSet resultSet, int i) throws SQLException {
            CoordinationDto coordination = new CoordinationDto();
            coordination.setId(resultSet.getInt("id"));
            coordination.setFileId(resultSet.getInt("fileId"));
            coordination.setSpaceId(resultSet.getInt("spaceId"));
            return coordination;
        }
    }

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setDatasource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }
}
