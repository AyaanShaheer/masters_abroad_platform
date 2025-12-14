"""merge migration branches

Revision ID: 46aeaa081be0
Revises: b4ab20f97a24
Create Date: 2025-12-14 18:03:37.546014

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '46aeaa081be0'
down_revision: Union[str, Sequence[str], None] = 'b4ab20f97a24'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
