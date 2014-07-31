package com.xjy.op.dao;


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
public class FileDao {

    //添加一个文件记录
    public boolean addFile(FileCommand file) {
        return 1 == jdbcTemplate.update(
                "insert into op_file values(null,?,?)",
                file.getName(), file.getType()
        );
    }

    //删除一个文件记录
    public boolean deleteFile(int id) {
        return 1 == jdbcTemplate.update(
                "delete from op_file where id=?",
                id
        );
    }

    //通过id获取文件
    public FileDto getFileById(int id) {
        return jdbcTemplate.queryForObject(
                "select * from op_file where id=?",
                new Object[]{id},
                new FileMapper()
        );
    }

    //通过名字搜索文件
    public List<FileDto> searchFileByName(String name) {
        return jdbcTemplate.query(
                "select * from op_file where name like ?",
                new Object[]{"%" + name + "%"},
                new FileMapper()
        );
    }

    //获取备课空间中的文件
    public List<FileDto> getSpaceFiles(int spaceId) {
        return jdbcTemplate.query(
                "select * from op_file where id in (select fileId from op_coordination where spaceId=?)",
                new Object[]{spaceId},
                new FileMapper()
        );
    }

    private final class FileMapper implements RowMapper<FileDto> {
        @Override
        public FileDto mapRow(ResultSet resultSet, int i) throws SQLException {
            FileDto file = new FileDto();
            file.setId(resultSet.getInt("id"));
            file.setName(resultSet.getString("name"));
            file.setType(resultSet.getString("type"));
            return file;
        }
    }

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setDatasource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }
}
