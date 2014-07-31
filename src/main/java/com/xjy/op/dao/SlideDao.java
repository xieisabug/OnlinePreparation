package com.xjy.op.dao;

import com.xjy.op.dto.DocumentDto;
import com.xjy.op.dto.SlideDto;
import com.xjy.op.dto.SlidePartDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
@Transactional
public class SlideDao {

    public SlideDto getSlideByFileId(int fileId) {
        SlideDto slideDto = jdbcTemplate.queryForObject(
                "select * from op_file_slide where fileId=?",
                new Object[]{fileId},
                new SlideMapper()
        );
        slideDto.setParts(getSlidePart(slideDto.getId()));
        return slideDto;
    }

    public int createSlide(final String name, final int spaceId) {
        final String sql = "insert into op_file(name, type) values(?,?)";
        final String sql2 = "insert into op_file_slide(fileId) values(?)";
        final String sql3 = "insert into op_coordination(spaceId, fileId) values(?, ?)";
        final String sql4 = "insert into op_file_slidepart(slideId, content) values(?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        int updateNum = jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setString(1, name);
                ps.setString(2, "slide");
                return ps;
            }
        }, keyHolder);
        if (updateNum != 1) {
            throw new RuntimeException("创建文件时错误");
        }
        final int ret = keyHolder.getKey().intValue();

        KeyHolder keyHolder2 = new GeneratedKeyHolder();
        int updateNum2 = jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement ps = connection.prepareStatement(sql2, new String[]{"id"});
                ps.setInt(1, ret);
                return ps;
            }
        }, keyHolder2);
        if (updateNum2 != 1) {
            throw new RuntimeException("创建演示文稿时错误");
        }

        if (jdbcTemplate.update(sql4, keyHolder2.getKey().intValue(), "") != 1) {
            throw new RuntimeException("创建演示文稿页面时错误");
        }

        if (jdbcTemplate.update(sql3, spaceId, ret) != 1) {
            throw new RuntimeException("文件挂接空间时发生错误");
        }

        return ret;
    }

    public List<SlidePartDto> getSlidePart(int slideId) {
        return jdbcTemplate.query(
                "select * from op_file_slidepart where slideId=?",
                new Object[]{slideId},
                new SlidePartMapper()
        );
    }

    public int insertSlidePart(final int slideId, final String content) {
        final String sql = "insert into op_file_slidepart(slideId, content) values(?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        int updateNum = jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setInt(1, slideId);
                ps.setString(2, content);
                return ps;
            }
        }, keyHolder);
        if (updateNum == 1) {
            return keyHolder.getKey().intValue();
        }
        return -1;
    }

    public void saveSlidePart(SlidePartDto slidePartDto) {
        String sql = "update op_file_slidepart set content=? where id=?";
        jdbcTemplate.update(sql, slidePartDto.getContent(), slidePartDto.getId());
    }

    private final class SlideMapper implements RowMapper<SlideDto> {
        @Override
        public SlideDto mapRow(ResultSet resultSet, int i) throws SQLException {
            SlideDto slideDto = new SlideDto();
            slideDto.setId(resultSet.getInt("id"));
            slideDto.setFileId(resultSet.getInt("fileId"));
            return slideDto;
        }
    }

    private final class SlidePartMapper implements RowMapper<SlidePartDto> {
        @Override
        public SlidePartDto mapRow(ResultSet resultSet, int i) throws SQLException {
            SlidePartDto slidePartDto = new SlidePartDto();
            slidePartDto.setId(resultSet.getInt("id"));
            slidePartDto.setSlideId(resultSet.getInt("slideId"));
            slidePartDto.setContent(resultSet.getString("content"));
            return slidePartDto;
        }
    }

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setDatasource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }
}

