package com.xjy.op.dao;

import com.sun.org.apache.xpath.internal.operations.Bool;
import com.xjy.op.dto.SpaceDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class SpaceDao {

    //增加一个备课空间
    public boolean addSpace(String spaceName, int createUserId) {
        return 1 == jdbcTemplate.update(
                "insert into op_space values(null,?,?,now())",
                spaceName, createUserId
        );
    }

    //修改备课空间
    public boolean editSpace(String spaceName, int id) {
        return 1 == jdbcTemplate.update(
                "update op_space set spaceName=? where id=?",
                spaceName, id
        );
    }

    //通过id获取备课空间
    public SpaceDto getSpaceById(int id) {
        return jdbcTemplate.queryForObject(
                "select * from op_space where id=?",
                new Object[]{id},
                new SpaceMapper()
        );
    }

    //删除备课空间
    public boolean deleteSpace(int id) {
        return 1 == jdbcTemplate.update(
                "delete from op_space where id=?",
                id
        );
    }

    //获取一个用户所能进入的备课空间
    public List<SpaceDto> getSpacesByUserId(int userId) {
        return jdbcTemplate.query(
                "select * from op_space where id in (select spaceId from op_user_space_join where userId=?)",
                new Object[]{userId},
                new SpaceMapper()
        );
    }

    public boolean isSpaceUser(int userId, int spaceId){
        Integer num = jdbcTemplate.queryForObject(
                "select count(*) from op_user_space_join where spaceId=? and userId=?",
                new Object[]{spaceId, userId},
                Integer.class);
        return num != 0;
    }

    private final class SpaceMapper implements RowMapper<SpaceDto> {
        @Override
        public SpaceDto mapRow(ResultSet resultSet, int i) throws SQLException {
            SpaceDto space = new SpaceDto();
            space.setId(resultSet.getInt("id"));
            space.setSpaceName(resultSet.getString("spaceName"));
            space.setCreateDate(resultSet.getDate("createDate"));
            space.setCreateUserId(resultSet.getInt("createUserId"));
            return space;
        }
    }

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setDatasource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }
}
